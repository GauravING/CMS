from django.urls import path
from .views import RegisterView , LoginAPIView , ProfileAPIView , AdminOnlyAPIView

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path("login/", LoginAPIView.as_view(), name="login"),
    path("me/", ProfileAPIView.as_view(), name="me"),
    path("admin-only/", AdminOnlyAPIView.as_view(), name="admin-only"),




]
