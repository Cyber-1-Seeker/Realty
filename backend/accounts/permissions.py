from rest_framework.permissions import BasePermission


# Для получения ролей в иерархии админок
class IsModerator(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'moderator'


class IsManager(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'manager'


class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'admin'


# Какой роли что можно сделать в админ панели
class CanViewApplications(BasePermission): # Смотреть на заявки
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ['moderator', 'manager', 'admin']


class CanManageUsers(BasePermission): # Управление пользователями
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ['manager', 'admin']


class CanEditPublishedApartments(BasePermission): # Управление опубликованных квартир
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ['manager', 'admin']


class CanAssignRoles(BasePermission): # Управление ролями других пользователей
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'admin'
