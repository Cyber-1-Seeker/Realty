from datetime import date
from .models import DailyStats, DailyIPLog
from django.utils.deprecation import MiddlewareMixin
from django.db import transaction
import hashlib
import logging
import threading

# Настраиваем логирование
logger = logging.getLogger(__name__)

# Глобальный словарь для отслеживания обработанных запросов
_processed_requests = {}
_lock = threading.Lock()


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


class SmartVisitMiddleware(MiddlewareMixin):
    """
    Middleware для подсчета ВСЕХ визитов на сайт.
    Считает +1 к визитам за каждый переход на любую страницу.
    """

    def process_response(self, request, response):
        """Обрабатываем ответ вместо запроса для избежания дублирования"""
        
        # Пропускаем только статические файлы и API вызовы
        if self._is_static_request(request):
            return response
            
        if self._is_api_request(request):
            return response

        # Создаем уникальный ключ для запроса
        request_key = f"{request.path}_{get_client_ip(request)}_{id(request)}"
        
        # Проверяем, был ли уже обработан этот запрос
        with _lock:
            if request_key in _processed_requests:
                return response
            _processed_requests[request_key] = True

        try:
            ip = get_client_ip(request)
            session_key = get_session_key(request)
            today = date.today()

            logger.info(f"✅ Processing visit from {ip} to {request.path}")
            print(f"✅ Processing visit from {ip} to {request.path}")

            # Используем атомарную транзакцию для безопасности
            with transaction.atomic():
                # Создаем или получаем запись статистики за сегодня
                stat, created = DailyStats.objects.get_or_create(
                    date=today,
                    defaults={
                        'visits': 0,
                        'new_visits': 0,
                        'new_registers': 0,
                        'new_applications': 0
                    }
                )

                # Проверяем, был ли уже этот IP сегодня и создаём, если нет (атомарно)
                ip_log, ip_created = DailyIPLog.objects.get_or_create(
                    ip_address=ip,
                    date=today
                )

                # Если IP новый - увеличиваем счетчик новых визитов
                if ip_created:
                    stat.new_visits += 1
                    logger.info(f"🆕 New IP visit: {ip}")
                    print(f"🆕 New IP visit: {ip}")

                # ВСЕГДА увеличиваем счетчик визитов на +1 за каждый переход
                old_visits = stat.visits
                stat.visits += 1
                logger.info(f"📈 Visit counted: {request.path} from {ip}, visits: {old_visits} → {stat.visits}")
                print(f"📈 Visit counted: {request.path} from {ip}, visits: {old_visits} → {stat.visits}")

                # Сохраняем статистику
                stat.save()
                
                logger.info(f"💾 Statistics saved successfully for {request.path}")
                print(f"💾 Statistics saved successfully for {request.path}")
                    
        except Exception as e:
            # Логируем ошибку, но не прерываем запрос
            logger.error(f"❌ Error in SmartVisitMiddleware: {e}")
            print(f"❌ Error in SmartVisitMiddleware: {e}")
            import traceback
            traceback.print_exc()

        return response

    def _is_static_request(self, request):
        """Проверяет, является ли запрос статическим"""
        path = request.path
        static_extensions = ['.js', '.css', '.png', '.jpg', '.svg', '.ico', '.woff2', '.woff', '.ttf', '.eot']
        return (
                any(path.endswith(ext) for ext in static_extensions) or
                '/static/' in path or
                '/media/' in path or
                path == '/favicon.ico' or
                path.startswith('/static/') or
                path.startswith('/media/')
        )

    def _is_api_request(self, request):
        """Проверяет, является ли запрос API вызовом"""
        path = request.path
        return (
                path.startswith('/admin/') or  # Только админку пропускаем
                'application/json' in request.META.get('CONTENT_TYPE', '') or
                request.META.get('HTTP_ACCEPT', '').startswith('application/json') or
                request.headers.get('X-Requested-With') == 'XMLHttpRequest'
        )
