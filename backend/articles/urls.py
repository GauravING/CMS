from django.urls import path
from .views import (
    CategoryListCreateAPIView,
    CategoryRetrieveUpdateDeleteAPIView,
    PostListCreateAPIView,
    PostRetrieveUpdateDeleteAPIView,
)

urlpatterns = [
    path("categories/", CategoryListCreateAPIView.as_view()),
    path("categories/<int:pk>/", CategoryRetrieveUpdateDeleteAPIView.as_view()),
    path("posts/", PostListCreateAPIView.as_view()),
    path("posts/<int:pk>/", PostRetrieveUpdateDeleteAPIView.as_view()),
]
