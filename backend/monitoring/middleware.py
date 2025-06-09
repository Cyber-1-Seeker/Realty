from datetime import date
from .models import DailyStats, DailyIPLog
from django.utils.deprecation import MiddlewareMixin
from django.db import transaction


def get_client_ip(request):
    """Извлекает IP пользователя из запроса, учитывая прокси"""
    x_forwarded = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded:
        return x_forwarded.split(',')[0]
    return request.META.get('REMOTE_ADDR')


class UserVisitMiddleware(MiddlewareMixin):
    """Middleware для подсчета визитов пользователей и уникальных IP"""

    def process_request(self, request):
        # Пропускаем статические файлы и служебные запросы
        if self._is_static_request(request):
            return

        ip = get_client_ip(request)
        today = date.today()

        # Используем атомарную транзакцию для безопасности
        with transaction.atomic():
            # Создаем или получаем запись статистики за сегодня
            stat, created = DailyStats.objects.get_or_create(
                date=today,
                defaults={
                    'visits': 0,
                    'new_visits': 0
                }
            )

            # Проверяем, был ли уже этот IP сегодня
            ip_log_exists = DailyIPLog.objects.filter(
                ip_address=ip,
                date=today
            ).exists()

            # Если IP новый - увеличиваем счетчик новых визитов
            if not ip_log_exists:
                DailyIPLog.objects.create(ip_address=ip, date=today)
                stat.new_visits += 1

            # Увеличиваем общий счетчик визитов
            stat.visits += 1
            stat.save()

    def _is_static_request(self, request):
        """Проверяет, является ли запрос статическим"""
        path = request.path
        return (
                path.endswith(('.js', '.css', '.png', '.jpg', '.svg', '.ico', '.woff2')) or
                '/static/' in path or
                path == '/favicon.ico'
        )
