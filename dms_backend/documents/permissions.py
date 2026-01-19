from rest_framework.permissions import BasePermission


# class IsUserOrAdmin(BasePermission):
#     def has_permission(self, request, view):
#         return request.user.is_authenticated

# class IsUserOnly(BasePermission):
#     def has_permission(self, request, view):
#         return request.user.is_authenticated and request.user.role == "USER"

# class IsAdminOnly(BasePermission):
#     def has_permission(self, request, view):
#         return request.user.is_authenticated and request.user.role == "ADMIN"

class IsUserRole(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == "USER"
        )

class IsAdminRole(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == "ADMIN"
        )
