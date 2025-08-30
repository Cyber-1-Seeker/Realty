from django.core.management.base import BaseCommand
from django.test import RequestFactory
from django.contrib.sessions.middleware import SessionMiddleware
from django.contrib.auth.middleware import AuthenticationMiddleware
from monitoring.middleware_v2 import SmartVisitMiddleware
from monitoring.models import DailyStats, DailyIPLog
from datetime import date
import time


class Command(BaseCommand):
    help = 'Реальное тестирование middleware без дублирования'

    def add_arguments(self, parser):
        parser.add_argument(
            '--visits',
            type=int,
            default=3,
            help='Количество тестовых визитов'
        )

    def handle(self, *args, **options):
        visits_count = options['visits']
        
        self.stdout.write(f"🧪 Реальное тестирование middleware для {visits_count} визитов...")
        
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
        
        # Симулируем визиты
        for i in range(visits_count):
            # Создаем новый запрос
            test_request = factory.get('/test/')
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
            
            self.stdout.write(f"  ✅ Визит {i+1}: IP 127.0.0.{i+1}")
            
            # Пауза между запросами
            time.sleep(0.5)
        
        # Проверяем результат
        try:
            stat = DailyStats.objects.get(date=today)
            final_visits = stat.visits
            visits_added = final_visits - initial_visits
            
            self.stdout.write(f"\n📈 Результат тестирования:")
            self.stdout.write(f"   Начало: {initial_visits} визитов")
            self.stdout.write(f"   Конец: {final_visits} визитов")
            self.stdout.write(f"   Добавлено: {visits_added} визитов")
            
            if visits_added == visits_count:
                self.stdout.write(f"   🎉 Middleware работает правильно!")
            else:
                self.stdout.write(f"   ❌ Middleware работает неправильно!")
                
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
        
        self.stdout.write(f"\n💡 Теперь откройте в браузере:")
        self.stdout.write(f"   http://localhost:8000/api/monitoring/simple/")
        self.stdout.write(f"   И обновите страницу несколько раз!")
