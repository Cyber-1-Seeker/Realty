from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone
from datetime import date
from .models import DailyStats
from accounts.models import CustomUser
from applications.models import Application


@receiver(post_save, sender=CustomUser)
def update_registration_stats(sender, instance, created, **kwargs):
    """Обновляет статистику при регистрации нового пользователя"""
    if created:
        try:
            today = date.today()
            stat, created = DailyStats.objects.get_or_create(
                date=today,
                defaults={
                    'visits': 0,
                    'new_visits': 0,
                    'new_registers': 0,
                    'new_applications': 0
                }
            )
            stat.new_registers += 1
            stat.save()
        except Exception as e:
            print(f"Error updating registration stats: {e}")


@receiver(post_save, sender=Application)
def update_application_stats(sender, instance, created, **kwargs):
    """Обновляет статистику при создании новой заявки"""
    if created:
        try:
            today = date.today()
            stat, created = DailyStats.objects.get_or_create(
                date=today,
                defaults={
                    'visits': 0,
                    'new_visits': 0,
                    'new_registers': 0,
                    'new_applications': 0
                }
            )
            stat.new_applications += 1
            stat.save()
        except Exception as e:
            print(f"Error updating application stats: {e}")
