from django.shortcuts import render

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import Post
from .serializers import PostSerializer
from .permissions import IsAdminEditorOrOwner


class PostListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Admin & Editor → see all posts
        Author → see only their own posts
        """
        user = self.request.user

        if user.role in ["admin", "editor"] or user.is_superuser:
            return Post.objects.all()

        return Post.objects.filter(author=user)

    def perform_create(self, serializer):
        """
        Automatically set author from logged-in user
        """
        serializer.save(author=self.request.user)


class PostRetrieveUpdateDeleteAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated, IsAdminEditorOrOwner]
