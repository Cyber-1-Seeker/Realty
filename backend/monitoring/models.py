from django.db import models


class DailyStats(models.Model):
    """Дневная агрегированная статистика по посещениям, заявкам и регистрациям"""
    date = models.DateField(unique=True)
    visits = models.IntegerField(default=0)  # Всего заходов за день
    new_visits = models.IntegerField(default=0)  # Уникальные IP за день
    new_registers = models.IntegerField(default=0)  # Регистрации
    new_applications = models.IntegerField(default=0)  # Созданные заявки

    class Meta:
        verbose_name = "Дневная статистика"
        verbose_name_plural = "Дневная статистика"
        ordering = ['-date']

    def __str__(self):
        return (f"{self.date}: {self.visits} визитов, {self.new_visits} уникальных, {self.new_registers} новых пользователей,"
                f" {self.new_applications} новых заявок")


class DailyIPLog(models.Model):
    """Лог IP-адресов, заходивших в конкретную дату (используется для подсчёта уникальных визитов)"""
    ip_address = models.GenericIPAddressField()
    date = models.DateField()

    class Meta:
        unique_together = ('ip_address', 'date')
        verbose_name = "IP лог посещения"
        verbose_name_plural = "IP логи посещений"

    def __str__(self):
        return f"{self.ip_address} — {self.date}"
