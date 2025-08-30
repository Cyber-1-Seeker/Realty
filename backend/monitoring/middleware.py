from datetime import date
from .models import DailyStats, DailyIPLog
from django.utils.deprecation import MiddlewareMixin
from django.db import transaction
import hashlib


def get_client_ip(request):
    """Извлекает IP пользователя из запроса, учитывая прокси"""
    x_forwarded = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded:
        return x_forwarded.split(',')[0]
    return request.META.get('REMOTE_ADDR')


def get_session_key(request):
    """Создает уникальный ключ сессии на основе IP и User-Agent"""
    ip = get_client_ip(request)
    user_agent = request.META.get('HTTP_USER_AGENT', '')
    session_string = f"{ip}:{user_agent}"
    return hashlib.md5(session_string.encode()).hexdigest()


class UserVisitMiddleware(MiddlewareMixin):
    """Middleware для подсчета визитов пользователей и уникальных IP"""

    def process_request(self, request):
        # Пропускаем статические файлы, служебные запросы и API вызовы
        if self._is_static_request(request) or self._is_api_request(request):
            return

        try:
            ip = get_client_ip(request)
            session_key = get_session_key(request)
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

                # Проверяем, был ли уже этот IP сегодня и создаём, если нет (атомарно)
                ip_log, created = DailyIPLog.objects.get_or_create(
                    ip_address=ip,
                    date=today
                )

                # Если IP новый - увеличиваем счетчик новых визитов
                if created:
                    stat.new_visits += 1

                # Проверяем, была ли уже эта сессия сегодня
                session_key_name = f"session_{session_key}"
                if not request.session.get(session_key_name):
                    # Это новая сессия - увеличиваем счетчик визитов
                    stat.visits += 1
                    request.session[session_key_name] = True
                    request.session.set_expiry(86400)  # 24 часа
                    stat.save()
        except Exception as e:
            # Логируем ошибку, но не прерываем запрос
            print(f"Error in UserVisitMiddleware: {e}")
            pass

    def _is_static_request(self, request):
        """Проверяет, является ли запрос статическим"""
        path = request.path
        return (
                path.endswith('.js', '.css', '.png', '.jpg', '.svg', '.ico', '.woff2') or
                '/static/' in path or
                path == '/favicon.ico'
        )
    
    def _is_api_request(self, request):
        """Проверяет, является ли запрос API вызовом"""
        path = request.path
        return (
                path.startswith('/api/') or
                path.startswith('/admin/') or
                'application/json' in request.META.get('CONTENT_TYPE', '') or
                request.META.get('HTTP_ACCEPT', '').startswith('application/json')
        )
