from __future__ import annotations

import os
import re
from dataclasses import dataclass
from typing import Any, Optional


def _clean_text(text: str) -> str:
    text = (text or "").strip()
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text


@dataclass
class SEOScore:
    score: int
    details: dict[str, Any]


def seo_score(content: str, *, focus_keyword: Optional[str] = None) -> SEOScore:
    content = _clean_text(content)
    length = len(content)

    has_h1 = bool(re.search(r"^#\s+.+", content, flags=re.MULTILINE))
    has_h2 = bool(re.search(r"^##\s+.+", content, flags=re.MULTILINE))

    keyword = (focus_keyword or "").strip().lower()
    keyword_hits = content.lower().count(keyword) if keyword else 0

    score = 0
    score += 30 if length >= 600 else 15 if length >= 300 else 5
    score += 20 if has_h1 else 0
    score += 15 if has_h2 else 0
    score += 20 if keyword and keyword_hits >= 2 else 10 if keyword and keyword_hits == 1 else 0
    score += 15 if "http" in content.lower() else 0

    score = max(0, min(100, score))

    return SEOScore(
        score=score,
        details={
            "length": length,
            "has_h1": has_h1,
            "has_h2": has_h2,
            "focus_keyword": keyword or None,
            "focus_keyword_hits": keyword_hits if keyword else None,
        },
    )


def summarize(content: str, *, max_sentences: int = 3) -> str:
    content = _clean_text(content)
    sentences = re.split(r"(?<=[.!?])\s+", content)
    sentences = [s.strip() for s in sentences if s.strip()]
    return " ".join(sentences[: max(1, max_sentences)])


def improve(content: str, *, tone: str = "professional") -> str:
    content = _clean_text(content)
    if not content:
        return ""

    # lightweight, deterministic improvements (safe fallback)
    improved = content
    improved = re.sub(r"\s+", " ", improved).strip()
    improved = improved.replace(" ,", ",").replace(" .", ".")

    prefix = {
        "professional": "",
        "friendly": "",
        "concise": "",
        "seo": "",
    }.get((tone or "professional").strip().lower(), "")

    return _clean_text((prefix + improved).strip())


def generate_draft(
    *,
    title: str,
    outline: Optional[list[str]] = None,
    tone: str = "professional",
    focus_keyword: Optional[str] = None,
    target_words: int = 700,
) -> str:
    title = (title or "").strip()
    if not title:
        return ""

    outline = outline or ["Introduction", "Key points", "Conclusion"]
    focus_keyword = (focus_keyword or "").strip() or None

    # Try OpenAI if configured; otherwise fallback to a deterministic draft.
    api_key = os.getenv("OPENAI_API_KEY")
    if api_key:
        try:
            from openai import OpenAI  # type: ignore

            client = OpenAI(api_key=api_key)
            prompt = {
                "title": title,
                "tone": tone,
                "focus_keyword": focus_keyword,
                "target_words": target_words,
                "outline": outline,
            }
            resp = client.chat.completions.create(
                model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
                messages=[
                    {
                        "role": "system",
                        "content": "You write high-quality CMS blog drafts. Output Markdown.",
                    },
                    {
                        "role": "user",
                        "content": (
                            "Write a well-structured Markdown article draft based on: "
                            f"{prompt}. Include headings, bullets where helpful, and a conclusion."
                        ),
                    },
                ],
                temperature=0.7,
            )
            text = resp.choices[0].message.content or ""
            return _clean_text(text)
        except Exception:
            # If OpenAI is misconfigured, gracefully fall back.
            pass

    headings = "\n".join([f"## {h}" for h in outline])
    keyword_line = f"\n\n**Focus keyword:** {focus_keyword}" if focus_keyword else ""

    return _clean_text(
        f"# {title}\n\n"
        f"*Tone:* {tone}{keyword_line}\n\n"
        "## Introduction\n"
        f"This article explains {title.lower()} with practical guidance and clear takeaways.\n\n"
        f"{headings}\n\n"
        "## Conclusion\n"
        "Summarize the key ideas and provide next steps the reader can take."
    )
