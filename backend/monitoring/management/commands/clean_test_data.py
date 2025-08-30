from django.core.management.base import BaseCommand
from monitoring.models import DailyStats, DailyIPLog
from datetime import date


class Command(BaseCommand):
    help = 'Очищает тестовые данные и сбрасывает статистику'

    def add_arguments(self, parser):
        parser.add_argument(
            '--action',
            type=str,
            choices=['clean_today', 'clean_all', 'reset'],
            default='clean_today',
            help='Действие: clean_today (очистить сегодня), clean_all (очистить все), reset (полный сброс)'
        )

    def handle(self, *args, **options):
        action = options['action']
        
        if action == 'clean_today':
            self.clean_today()
        elif action == 'clean_all':
            self.clean_all()
        elif action == 'reset':
            self.reset_all()

    def clean_today(self):
        """Очищает данные за сегодня"""
        today = date.today()
        
        # Удаляем IP логи за сегодня
        ip_logs_deleted, _ = DailyIPLog.objects.filter(date=today).delete()
        
        # Сбрасываем счетчики за сегодня
        try:
            stat = DailyStats.objects.get(date=today)
            stat.visits = 0
            stat.new_visits = 0
            stat.save()
            self.stdout.write(f"✅ Сброшены счетчики за {today}")
        except DailyStats.DoesNotExist:
            self.stdout.write(f"ℹ️ Нет данных статистики за {today}")
        
        self.stdout.write(f"🗑️ Удалено {ip_logs_deleted} IP логов за {today}")

    def clean_all(self):
        """Очищает все данные"""
        # Удаляем все IP логи
        ip_logs_deleted, _ = DailyIPLog.objects.all().delete()
        
        # Сбрасываем все счетчики
        stats_updated = DailyStats.objects.all().update(
            visits=0,
            new_visits=0
        )
        
        self.stdout.write(f"✅ Сброшены счетчики в {stats_updated} записях статистики")
        self.stdout.write(f"🗑️ Удалено {ip_logs_deleted} IP логов")

    def reset_all(self):
        """Полный сброс всей статистики"""
        # Удаляем все данные
        ip_logs_deleted, _ = DailyIPLog.objects.all().delete()
        stats_deleted, _ = DailyStats.objects.all().delete()
        
        self.stdout.write(f"🗑️ Удалено {stats_deleted} записей статистики")
        self.stdout.write(f"🗑️ Удалено {ip_logs_deleted} IP логов")
        self.stdout.write("✅ Вся статистика полностью сброшена")
