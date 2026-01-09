from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    AdminOnlyAPIView,
    AdminUserListAPIView,
    AdminUserRoleUpdateAPIView,
    ProfileAPIView,
    RegisterView,
    TokenView,
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('token/', TokenView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path("me/", ProfileAPIView.as_view(), name="me"),
    path("admin-only/", AdminOnlyAPIView.as_view(), name="admin-only"),
    path("admin/users/", AdminUserListAPIView.as_view(), name="admin-users"),
    path("admin/users/<int:pk>/role/", AdminUserRoleUpdateAPIView.as_view(), name="admin-user-role"),

]
