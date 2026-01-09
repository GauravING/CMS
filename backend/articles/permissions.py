from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsAdminEditorOrOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user.role == "admin":
            return True

        if request.user.role == "editor" and request.method in SAFE_METHODS:
            return True

        return obj.author == request.user
