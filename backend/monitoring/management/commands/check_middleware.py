from django.core.management.base import BaseCommand
from django.test import RequestFactory
from django.contrib.sessions.middleware import SessionMiddleware
from django.contrib.auth.middleware import AuthenticationMiddleware
from monitoring.middleware_v2 import SmartVisitMiddleware
from monitoring.models import DailyStats, DailyIPLog
from datetime import date
import time


class Command(BaseCommand):
    help = 'Проверяет работу middleware в реальном времени'

    def add_arguments(self, parser):
        parser.add_argument(
            '--wait',
            type=int,
            default=10,
            help='Время ожидания в секундах для проверки'
        )

    def handle(self, *args, **options):
        wait_time = options['wait']
        
        self.stdout.write(f"🧪 Проверка middleware в реальном времени...")
        self.stdout.write(f"⏰ Ожидание {wait_time} секунд для проверки...")
        
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
            self.stdout.write(f"📊 Начальное количество визитов: 0 (создаем запись)")
        
        # Симулируем несколько визитов
        test_pages = ['/', '/about', '/listings', '/profile', '/contact']
        
        for i, page in enumerate(test_pages):
            # Создаем новый запрос
            test_request = factory.get(page)
            test_request.META['REMOTE_ADDR'] = f'192.168.1.{100+i}'
            test_request.META['HTTP_USER_AGENT'] = f'TestBrowser/{i+1}'
            
            # Добавляем middleware
            session_middleware.process_request(test_request)
            auth_middleware.process_request(test_request)
            
            # Создаем заглушку ответа
            from django.http import HttpResponse
            dummy_response = HttpResponse("Test")
            
            # Обрабатываем через наш middleware
            middleware.process_response(test_request, dummy_response)
            
            self.stdout.write(f"  ✅ Обработана страница: {page}")
            
            # Небольшая пауза между запросами
            time.sleep(0.1)
        
        # Проверяем результат
        try:
            stat = DailyStats.objects.get(date=today)
            final_visits = stat.visits
            visits_added = final_visits - initial_visits
            
            self.stdout.write(f"\n📈 Результат проверки:")
            self.stdout.write(f"   Начало: {initial_visits} визитов")
            self.stdout.write(f"   Конец: {final_visits} визитов")
            self.stdout.write(f"   Добавлено: {visits_added} визитов")
            
            if visits_added == len(test_pages):
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
        
        self.stdout.write(f"\n💡 Теперь откройте любую страницу сайта и проверьте, увеличивается ли счетчик!")
