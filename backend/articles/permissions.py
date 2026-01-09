from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsAdminEditorOrOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        if not request.user.is_authenticated:
            return False
        if request.user.role in {"admin", "editor"} or getattr(request.user, "is_superuser", False):
            return True
        return obj.author == request.user


class IsAdminOrEditorOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return request.user.is_authenticated
        return request.user.is_authenticated and request.user.role in {"admin", "editor"}
