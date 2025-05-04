from rest_framework.permissions import BasePermission

class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            request.user.groups.filter(name='admin').exists()
        )

class IsCustomer(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            request.user.groups.filter(name='customer').exists()
        )

class IsEmployee(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            request.user.groups.filter(name='employee').exists()
        )

class IsAdminOrEmployee(BasePermission):
    def has_permission(self, request, view):
        user = request.user
        return (
            user and user.is_authenticated and
            user.groups.filter(name__in=['admin', 'employee']).exists()
        )
    
class IsAnyUser(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated