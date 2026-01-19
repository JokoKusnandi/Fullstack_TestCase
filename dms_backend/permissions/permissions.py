from rest_framework.permissions import BasePermission

class IsUserRole(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == "USER"
        )

class IsAdminRole(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user and
            request.user.is_authenticated
            and request.user.role == "ADMIN"
        )