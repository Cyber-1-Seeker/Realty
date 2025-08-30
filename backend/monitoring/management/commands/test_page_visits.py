from django.core.management.base import BaseCommand
from django.test import RequestFactory
from django.contrib.sessions.middleware import SessionMiddleware
from django.contrib.auth.middleware import AuthenticationMiddleware
from monitoring.middleware_v2 import SmartVisitMiddleware
from monitoring.models import DailyStats, DailyIPLog
from datetime import date


class Command(BaseCommand):
    help = 'Тестирует middleware для подсчета переходов по страницам'

    def add_arguments(self, parser):
        parser.add_argument(
            '--pages',
            type=int,
            default=5,
            help='Количество страниц для посещения'
        )

    def handle(self, *args, **options):
        pages_count = options['pages']
        
        self.stdout.write(f"🧪 Тестирование переходов по {pages_count} страницам...")
        
        # Создаем фабрику запросов
        factory = RequestFactory()
        
        # Создаем middleware с заглушкой для get_response
        def dummy_get_response(request):
            return None
        
        middleware = SmartVisitMiddleware(dummy_get_response)
        session_middleware = SessionMiddleware(dummy_get_response)
        auth_middleware = AuthenticationMiddleware(dummy_get_response)
        
        # Список страниц для тестирования
        test_pages = [
            '/',  # Главная
            '/about',  # О нас
            '/listings',  # Объявления
            '/profile',  # Профиль
            '/contact',  # Контакты
            '/support',  # Поддержка
            '/privacy',  # Приватность
            '/test/',  # Тестовая
        ]
        
        # Симулируем переходы по страницам
        for i in range(pages_count):
            page = test_pages[i % len(test_pages)]
            
            # Создаем новый запрос для каждой страницы
            test_request = factory.get(page)
            test_request.META['REMOTE_ADDR'] = '192.168.1.100'  # Один IP
            test_request.META['HTTP_USER_AGENT'] = 'TestBrowser/1.0'
            
            # Добавляем middleware
            session_middleware.process_request(test_request)
            auth_middleware.process_request(test_request)
            
            # Обрабатываем через наш middleware
            middleware.process_request(test_request)
            
            self.stdout.write(f"  Страница {i+1}: {page}")
        
        # Проверяем результат
        today = date.today()
        try:
            stat = DailyStats.objects.get(date=today)
            self.stdout.write(f"\n✅ Результат тестирования:")
            self.stdout.write(f"   Дата: {today}")
            self.stdout.write(f"   Всего визитов: {stat.visits}")
            self.stdout.write(f"   Уникальных IP: {stat.new_visits}")
            
            # Проверяем, что счетчики увеличились на количество страниц
            expected_visits = pages_count
            if stat.visits == expected_visits:
                self.stdout.write(f"   🎉 Middleware работает правильно! Счетчик визитов: {stat.visits} (ожидалось: {expected_visits})")
            else:
                self.stdout.write(f"   ❌ Middleware работает неправильно! Счетчик визитов: {stat.visits} (ожидалось: {expected_visits})")
                
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
