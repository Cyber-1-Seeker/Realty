from django.contrib import admin
from .models import DailyStats, DailyIPLog


@admin.register(DailyStats)
class DailyStatsAdmin(admin.ModelAdmin):
    list_display = ['date', 'visits', 'new_visits', 'new_registers', 'new_applications']
    list_filter = ['date']
    ordering = ['-date']
    readonly_fields = ['date']
    
    def has_add_permission(self, request):
        return False  # Запрещаем ручное создание записей
    
    def has_delete_permission(self, request, obj=None):
        return True  # Разрешаем удаление для очистки
    
    actions = ['reset_counters']
    
    def reset_counters(self, request, queryset):
        updated = queryset.update(
            visits=0,
            new_visits=0,
            new_registers=0,
            new_applications=0
        )
        self.message_user(request, f'Счетчики сброшены для {updated} записей')
    reset_counters.short_description = "Сбросить счетчики"


@admin.register(DailyIPLog)
class DailyIPLogAdmin(admin.ModelAdmin):
    list_display = ['ip_address', 'date']
    list_filter = ['date']
    ordering = ['-date']
    readonly_fields = ['ip_address', 'date']
    
    def has_add_permission(self, request):
        return False  # Запрещаем ручное создание записей
