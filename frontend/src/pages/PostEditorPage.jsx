import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Button from '../components/Button'
import Card from '../components/Card'
import Input from '../components/Input'
import { getPost, listCategories, updatePost } from '../api/articles'
import { generateDraft, improveContent, seoScore, summarizeContent } from '../api/ai'

export default function PostEditorPage() {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [categories, setCategories] = useState([])
  const [saving, setSaving] = useState(false)
  const [aiBusy, setAiBusy] = useState(false)
  const [aiKeyword, setAiKeyword] = useState('')
  const [aiTone, setAiTone] = useState('professional')
  const [seo, setSeo] = useState(null)
  const [summary, setSummary] = useState('')

  async function load() {
    const [p, cats] = await Promise.all([getPost(id), listCategories()])
    setPost({
      ...p,
      category_id: p.category?.id ?? null
    })
    setCategories(cats)
  }

  useEffect(() => {
    load()
  }, [id])

  const markdown = useMemo(() => post?.content || '', [post])

  async function save(patch) {
    setSaving(true)
    try {
      const updated = await updatePost(id, patch)
      setPost({ ...updated, category_id: updated.category?.id ?? null })
    } finally {
      setSaving(false)
    }
  }

  async function runGenerate() {
    if (!post?.title) return
    setAiBusy(true)
    try {
      const data = await generateDraft({
        title: post.title,
        tone: aiTone,
        focus_keyword: aiKeyword || undefined,
        target_words: 800
      })
      await save({ content: data.content })
    } finally {
      setAiBusy(false)
    }
  }

  async function runImprove() {
    setAiBusy(true)
    try {
      const data = await improveContent({ content: post?.content || '', tone: aiTone })
      await save({ content: data.content })
    } finally {
      setAiBusy(false)
    }
  }

  async function runSummary() {
    setAiBusy(true)
    try {
      const data = await summarizeContent({ content: post?.content || '', max_sentences: 3 })
      setSummary(data.summary)
    } finally {
      setAiBusy(false)
    }
  }

  async function runSeo() {
    setAiBusy(true)
    try {
      const data = await seoScore({ content: post?.content || '', focus_keyword: aiKeyword || undefined })
      setSeo(data)
    } finally {
      setAiBusy(false)
    }
  }

  if (!post) return <div className="text-sm text-slate-400">Loading…</div>

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Editor</h1>
            <p className="mt-1 text-sm text-slate-400">Post #{post.id}</p>
          </div>
          <Button variant="ghost" onClick={() => save({})} disabled={saving}>
            {saving ? 'Saving…' : 'Save'}
          </Button>
        </div>

        <Card className="space-y-4">
          <Input label="Title" value={post.title} onChange={(e) => setPost({ ...post, title: e.target.value })} />

          <label className="block">
            <div className="mb-1 text-xs text-slate-300">Category</div>
            <select
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-400/40"
              value={post.category_id ?? ''}
              onChange={(e) => setPost({ ...post, category_id: e.target.value ? Number(e.target.value) : null })}
            >
              <option value="">— None —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <div className="mb-1 text-xs text-slate-300">Status</div>
            <select
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-400/40"
              value={post.status}
              onChange={(e) => setPost({ ...post, status: e.target.value })}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </label>

          <label className="block">
            <div className="mb-1 text-xs text-slate-300">Content (Markdown)</div>
            <textarea
              className="min-h-[300px] w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-400/40"
              value={post.content}
              onChange={(e) => setPost({ ...post, content: e.target.value })}
              placeholder="# Your article…"
            />
          </label>

          <div className="flex gap-2">
            <Button
              onClick={() => save({
                title: post.title,
                content: post.content,
                status: post.status,
                category_id: post.category_id
              })}
              disabled={saving}
            >
              {saving ? 'Saving…' : 'Save changes'}
            </Button>
            <Button variant="ghost" onClick={load} disabled={saving}>
              Reload
            </Button>
          </div>
        </Card>

        <Card>
          <div className="mb-2 text-sm font-medium">Preview</div>
          <div className="prose prose-invert max-w-none prose-slate">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
          </div>
        </Card>
      </div>

      <div className="space-y-4">
        <Card className="space-y-4">
          <div>
            <div className="text-sm font-medium">AI Assistant</div>
            <div className="text-xs text-slate-400">Uses OpenAI if configured, otherwise a safe fallback.</div>
          </div>

          <Input label="Focus keyword" value={aiKeyword} onChange={(e) => setAiKeyword(e.target.value)} placeholder="e.g. django cms" />

          <label className="block">
            <div className="mb-1 text-xs text-slate-300">Tone</div>
            <select
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-400/40"
              value={aiTone}
              onChange={(e) => setAiTone(e.target.value)}
            >
              <option value="professional">Professional</option>
              <option value="friendly">Friendly</option>
              <option value="concise">Concise</option>
              <option value="seo">SEO</option>
            </select>
          </label>

          <div className="grid grid-cols-2 gap-2">
            <Button variant="ghost" onClick={runGenerate} disabled={aiBusy}>
              Generate draft
            </Button>
            <Button variant="ghost" onClick={runImprove} disabled={aiBusy}>
              Improve
            </Button>
            <Button variant="ghost" onClick={runSeo} disabled={aiBusy}>
              SEO score
            </Button>
            <Button variant="ghost" onClick={runSummary} disabled={aiBusy}>
              Summarize
            </Button>
          </div>

          {seo ? (
            <div className="rounded-xl border border-white/10 bg-slate-950/40 p-3">
              <div className="text-sm font-medium">SEO Score: {seo.score}/100</div>
              <div className="mt-1 text-xs text-slate-400">Length: {seo.details.length} • H1: {String(seo.details.has_h1)} • H2: {String(seo.details.has_h2)}</div>
            </div>
          ) : null}

          {summary ? (
            <div className="rounded-xl border border-white/10 bg-slate-950/40 p-3">
              <div className="text-sm font-medium">Summary</div>
              <div className="mt-1 text-xs text-slate-300">{summary}</div>
            </div>
          ) : null}
        </Card>
      </div>
    </div>
  )
}
