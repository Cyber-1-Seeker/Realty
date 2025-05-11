from datetime import date
from .models import DailyStats, DailyIPLog
from django.utils.deprecation import MiddlewareMixin


def get_client_ip(request):
    """Извлекает IP пользователя из запроса, учитывая прокси"""
    x_forwarded = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded:
        return x_forwarded.split(',')[0]
    return request.META.get('REMOTE_ADDR')


class UserVisitMiddleware(MiddlewareMixin):
    """
    Middleware, который считает визиты пользователей и уникальные IP в DailyStats
    """

    def process_request(self, request):
        ip = get_client_ip(request)
        today = date.today()

        # Пропускаем тех, кто делает вспомогательные запросы
        if request.path.endswith(('.js', '.css', '.png', '.jpg', '.svg', '.ico', '.woff2')) \
                or 'static/' in request.path \
                or request.path == '/favicon.ico':
            return

        # Создаём или обновляем запись за сегодня
        stat, _ = DailyStats.objects.get_or_create(date=today)
        stat.visits += 1

        # Учитываем уникальные визиты по IP
        if not DailyIPLog.objects.filter(ip_address=ip, date=today).exists():
            DailyIPLog.objects.create(ip_address=ip, date=today)
            stat.new_visits += 1

        stat.save()
