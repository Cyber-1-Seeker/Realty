from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import date, timedelta
from monitoring.models import DailyStats, DailyIPLog
from django.db import models


class Command(BaseCommand):
    help = 'Тестирует и отлаживает систему статистики'

    def add_arguments(self, parser):
        parser.add_argument(
            '--action',
            type=str,
            choices=['show', 'create', 'reset'],
            default='show',
            help='Действие: show (показать), create (создать тестовые данные), reset (сбросить)'
        )

    def handle(self, *args, **options):
        action = options['action']
        
        if action == 'show':
            self.show_stats()
        elif action == 'create':
            self.create_test_data()
        elif action == 'reset':
            self.reset_stats()

    def show_stats(self):
        """Показывает текущую статистику"""
        self.stdout.write("=== ТЕКУЩАЯ СТАТИСТИКА ===")
        
        # Показываем последние 7 дней
        today = date.today()
        for i in range(7):
            check_date = today - timedelta(days=i)
            try:
                stat = DailyStats.objects.get(date=check_date)
                self.stdout.write(
                    f"{check_date}: visits={stat.visits}, "
                    f"new_visits={stat.new_visits}, "
                    f"new_registers={stat.new_registers}, "
                    f"new_applications={stat.new_applications}"
                )
            except DailyStats.DoesNotExist:
                self.stdout.write(f"{check_date}: Нет данных")
        
        # Общая статистика
        total_stats = DailyStats.objects.aggregate(
            total_visits=models.Sum('visits'),
            total_new_visits=models.Sum('new_visits'),
            total_registers=models.Sum('new_registers'),
            total_applications=models.Sum('new_applications')
        )
        
        self.stdout.write("\n=== ОБЩАЯ СТАТИСТИКА ===")
        for key, value in total_stats.items():
            self.stdout.write(f"{key}: {value or 0}")

    def create_test_data(self):
        """Создает тестовые данные для последних 7 дней"""
        self.stdout.write("Создание тестовых данных...")
        
        today = date.today()
        for i in range(7):
            check_date = today - timedelta(days=i)
            stat, created = DailyStats.objects.get_or_create(
                date=check_date,
                defaults={
                    'visits': 0,
                    'new_visits': 0,
                    'new_registers': 0,
                    'new_applications': 0
                }
            )
            
            if created:
                # Генерируем случайные данные
                import random
                stat.visits = random.randint(10, 100)
                stat.new_visits = random.randint(1, 5)
                stat.new_registers = random.randint(0, 3)
                stat.new_applications = random.randint(0, 8)
                stat.save()
                self.stdout.write(f"Создана запись для {check_date}")
            else:
                self.stdout.write(f"Запись для {check_date} уже существует")

    def reset_stats(self):
        """Сбрасывает всю статистику"""
        self.stdout.write("Сброс всей статистики...")
        
        DailyStats.objects.all().delete()
        DailyIPLog.objects.all().delete()
        
        self.stdout.write("Статистика сброшена")
