from rest_framework.permissions import BasePermission, SAFE_METHODS


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


"""Какой роли что можно сделать в админ панели"""


class CanViewApplications(BasePermission):
    """Управление заявками и смотреть на мониторинг"""

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ['moderator', 'manager', 'admin']


class CanManageUsers(BasePermission):
    """Управление пользователями"""

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ['manager', 'admin']


class CanEditPublishedApartments(BasePermission):
    """Управление опубликованных квартир"""

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ['moderator', 'manager', 'admin']


class CanAssignRoles(BasePermission):
    """Управление ролями других пользователей"""

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'admin'


class IsNotSelfOrReadOnly(BasePermission):
    """
    Запрещает пользователям изменять или удалять свой собственный аккаунт.
    Разрешает чтение и другие действия для админов.
    """

    def has_object_permission(self, request, view, obj):
        # Разрешаем безопасные методы (GET, HEAD, OPTIONS)
        if request.method in SAFE_METHODS:
            return True

        # Запрещаем изменение/удаление своего аккаунта
        return obj != request.user
