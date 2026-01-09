from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .services import generate_draft, improve, seo_score, summarize


class GenerateDraftAPIView(APIView):
	permission_classes = [IsAuthenticated]

	def post(self, request):
		title = request.data.get("title", "")
		outline = request.data.get("outline")
		tone = request.data.get("tone", "professional")
		focus_keyword = request.data.get("focus_keyword")
		target_words = int(request.data.get("target_words", 700))

		text = generate_draft(
			title=title,
			outline=outline,
			tone=tone,
			focus_keyword=focus_keyword,
			target_words=target_words,
		)
		return Response({"content": text})


class ImproveContentAPIView(APIView):
	permission_classes = [IsAuthenticated]

	def post(self, request):
		content = request.data.get("content", "")
		tone = request.data.get("tone", "professional")
		return Response({"content": improve(content, tone=tone)})


class SummarizeAPIView(APIView):
	permission_classes = [IsAuthenticated]

	def post(self, request):
		content = request.data.get("content", "")
		max_sentences = int(request.data.get("max_sentences", 3))
		return Response({"summary": summarize(content, max_sentences=max_sentences)})


class SEOScoreAPIView(APIView):
	permission_classes = [IsAuthenticated]

	def post(self, request):
		content = request.data.get("content", "")
		focus_keyword = request.data.get("focus_keyword")
		result = seo_score(content, focus_keyword=focus_keyword)
		return Response({"score": result.score, "details": result.details})
