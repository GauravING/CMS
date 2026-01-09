from django.urls import path

from .views import GenerateDraftAPIView, ImproveContentAPIView, SEOScoreAPIView, SummarizeAPIView

urlpatterns = [
    path("generate/", GenerateDraftAPIView.as_view(), name="ai-generate"),
    path("improve/", ImproveContentAPIView.as_view(), name="ai-improve"),
    path("summarize/", SummarizeAPIView.as_view(), name="ai-summarize"),
    path("seo-score/", SEOScoreAPIView.as_view(), name="ai-seo-score"),
]
