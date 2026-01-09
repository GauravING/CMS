from django.contrib.auth import get_user_model
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView

from .permissions import IsAdmin
from .serializers import (
    CustomTokenObtainPairSerializer,
    MeSerializer,
    RegisterSerializer,
    UserAdminSerializer,
)


User = get_user_model()



class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        # Security: do not allow public self-registration as admin/editor.
        serializer.save(role="author")


class TokenView(TokenObtainPairView):
    permission_classes = [AllowAny]
    serializer_class = CustomTokenObtainPairSerializer
    
# protected endpoint
class ProfileAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(MeSerializer(request.user).data)


class AdminUserListAPIView(generics.ListAPIView):
    queryset = User.objects.all().order_by("-date_joined")
    serializer_class = UserAdminSerializer
    permission_classes = [IsAdmin]


class AdminUserRoleUpdateAPIView(generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserAdminSerializer
    permission_classes = [IsAdmin]

    def update(self, request, *args, **kwargs):
        user = self.get_object()
        role = request.data.get("role")
        allowed = {"admin", "editor", "author"}
        if role not in allowed:
            return Response({"detail": f"role must be one of {sorted(allowed)}"}, status=400)
        user.role = role
        user.save(update_fields=["role"])
        return Response(UserAdminSerializer(user).data)

class AdminOnlyAPIView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        return Response({
            "message": "Admin access granted"
        })      