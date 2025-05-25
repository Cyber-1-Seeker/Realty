from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings
import httpx
from .models import Application


@receiver(post_save, sender=Application)
def send_telegram_notification(sender, instance, created, **kwargs):
    if created:
        try:
            message = (
                f"🚀 Новая заявка #{instance.id}\n"
                f"👤 Имя: {instance.name}\n"
                f"📞 Телефон: {instance.phone}\n"
                f"📝 Комментарий: {instance.comment}"
            )

            # Отправляем сообщение напрямую через API Telegram
            httpx.post(
                f"https://api.telegram.org/bot{settings.BOT_TOKEN}/sendMessage",
                json={
                    "chat_id": settings.ADMIN_CHAT_ID,
                    "text": message,
                    "parse_mode": "HTML"
                },
                timeout=5
            )
        except Exception as e:
            print(f"Ошибка отправки уведомления: {e}")
