from django.core.management.base import BaseCommand
from django.test import RequestFactory
from django.contrib.sessions.middleware import SessionMiddleware
from django.contrib.auth.middleware import AuthenticationMiddleware
from monitoring.middleware_v2 import SmartVisitMiddleware
from monitoring.models import DailyStats, DailyIPLog
from datetime import date
import time


class Command(BaseCommand):
    help = 'Тестирует middleware для API запросов'

    def add_arguments(self, parser):
        parser.add_argument(
            '--visits',
            type=int,
            default=5,
            help='Количество тестовых API запросов'
        )

    def handle(self, *args, **options):
        visits_count = options['visits']
        
        self.stdout.write(f"🧪 Тестирование middleware для {visits_count} API запросов...")
        
        # Создаем фабрику запросов
        factory = RequestFactory()
        
        # Создаем middleware с заглушкой для get_response
        def dummy_get_response(request):
            return None
        
        middleware = SmartVisitMiddleware(dummy_get_response)
        session_middleware = SessionMiddleware(dummy_get_response)
        auth_middleware = AuthenticationMiddleware(dummy_get_response)
        
        # Получаем текущую статистику
        today = date.today()
        try:
            stat = DailyStats.objects.get(date=today)
            initial_visits = stat.visits
            self.stdout.write(f"📊 Начальное количество визитов: {initial_visits}")
        except DailyStats.DoesNotExist:
            initial_visits = 0
            self.stdout.write(f"📊 Начальное количество визитов: 0")
        
        # Список API эндпоинтов для тестирования
        api_endpoints = [
            '/api/applications/applications/',
            '/api/monitoring/daily/',
            '/api/apartment/apartments/',
            '/api/accounts/users/',
            '/api/testimonials/testimonials/',
        ]
        
        # Симулируем API запросы
        for i in range(visits_count):
            endpoint = api_endpoints[i % len(api_endpoints)]
            
            # Создаем новый запрос
            test_request = factory.get(endpoint)
            test_request.META['REMOTE_ADDR'] = f'127.0.0.{i+1}'
            test_request.META['HTTP_USER_AGENT'] = f'TestBrowser/{i+1}'
            
            # Добавляем middleware
            session_middleware.process_request(test_request)
            auth_middleware.process_request(test_request)
            
            # Создаем заглушку ответа
            from django.http import HttpResponse
            dummy_response = HttpResponse("Test")
            
            # Обрабатываем через наш middleware
            middleware.process_response(test_request, dummy_response)
            
            self.stdout.write(f"  ✅ API запрос {i+1}: {endpoint}")
            
            # Пауза между запросами
            time.sleep(0.3)
        
        # Проверяем результат
        try:
            stat = DailyStats.objects.get(date=today)
            final_visits = stat.visits
            visits_added = final_visits - initial_visits
            
            self.stdout.write(f"\n📈 Результат тестирования API:")
            self.stdout.write(f"   Начало: {initial_visits} визитов")
            self.stdout.write(f"   Конец: {final_visits} визитов")
            self.stdout.write(f"   Добавлено: {visits_added} визитов")
            
            if visits_added == visits_count:
                self.stdout.write(f"   🎉 Middleware работает правильно для API!")
            else:
                self.stdout.write(f"   ❌ Middleware работает неправильно для API!")
                
        except DailyStats.DoesNotExist:
            self.stdout.write(f"❌ Нет данных статистики за {today}")
        
        # Показываем все IP логи за сегодня
        ip_logs = DailyIPLog.objects.filter(date=today)
        if ip_logs.exists():
            self.stdout.write(f"\n📝 IP логи за сегодня:")
            for log in ip_logs:
                self.stdout.write(f"   {log.ip_address}")
        else:
            self.stdout.write(f"\n📝 IP логи за сегодня: нет данных")
        
        self.stdout.write(f"\n💡 Теперь проверьте в браузере:")
        self.stdout.write(f"   Откройте любую страницу с API и обновите её!")
        self.stdout.write(f"   Счетчик визитов должен увеличиваться!")
