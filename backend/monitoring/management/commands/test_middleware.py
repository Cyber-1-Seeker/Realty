from django.core.management.base import BaseCommand
from django.test import RequestFactory
from django.contrib.sessions.middleware import SessionMiddleware
from django.contrib.auth.middleware import AuthenticationMiddleware
from monitoring.middleware_v2 import SmartVisitMiddleware
from monitoring.models import DailyStats, DailyIPLog
from datetime import date


class Command(BaseCommand):
    help = 'Тестирует middleware для подсчета визитов'

    def add_arguments(self, parser):
        parser.add_argument(
            '--visits',
            type=int,
            default=5,
            help='Количество тестовых визитов для симуляции'
        )

    def handle(self, *args, **options):
        visits_count = options['visits']
        
        self.stdout.write(f"🧪 Тестирование middleware для {visits_count} визитов...")
        
        # Создаем фабрику запросов
        factory = RequestFactory()
        
        # Создаем middleware с заглушкой для get_response
        def dummy_get_response(request):
            return None
        
        middleware = SmartVisitMiddleware(dummy_get_response)
        session_middleware = SessionMiddleware(dummy_get_response)
        auth_middleware = AuthenticationMiddleware(dummy_get_response)
        
        # Создаем базовый запрос
        request = factory.get('/test/')
        
        # Добавляем middleware
        session_middleware.process_request(request)
        auth_middleware.process_request(request)
        
        # Симулируем несколько визитов
        for i in range(visits_count):
            # Создаем новый запрос для каждого визита
            test_request = factory.get('/test/')
            test_request.META['REMOTE_ADDR'] = f'192.168.1.{i+1}'
            test_request.META['HTTP_USER_AGENT'] = f'TestBrowser/{i+1}'
            
            # Добавляем middleware
            session_middleware.process_request(test_request)
            auth_middleware.process_request(test_request)
            
            # Обрабатываем через наш middleware
            middleware.process_request(test_request)
            
            self.stdout.write(f"  Визит {i+1}: IP 192.168.1.{i+1}")
        
        # Проверяем результат
        today = date.today()
        try:
            stat = DailyStats.objects.get(date=today)
            self.stdout.write(f"\n✅ Результат тестирования:")
            self.stdout.write(f"   Дата: {today}")
            self.stdout.write(f"   Всего визитов: {stat.visits}")
            self.stdout.write(f"   Уникальных IP: {stat.new_visits}")
            
            # Проверяем, что счетчики увеличились
            if stat.visits > 0:
                self.stdout.write(f"   🎉 Middleware работает! Счетчик визитов: {stat.visits}")
            else:
                self.stdout.write(f"   ❌ Middleware не работает. Счетчик визитов: {stat.visits}")
                
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
