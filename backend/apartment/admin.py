from django.contrib import admin
from .models import Apartment, ApartmentImage


@admin.register(Apartment)
class ApartmentAdmin(admin.ModelAdmin):
    list_display = [
        'address', 'property_type', 'deal_type', 'price', 
        'total_area_from', 'total_area_to', 'rooms', 'status', 'owner', 'created_at'
    ]
    list_filter = [
        'status', 'property_type', 'deal_type', 'bathroom_type', 'view',
        'is_active', 'created_at'
    ]
    search_fields = ['address', 'owner__first_name', 'owner__email']
    readonly_fields = ['created_at', 'is_active']
    
    fieldsets = (
        ('Основная информация', {
            'fields': ('owner', 'status', 'rejection_reason', 'property_type', 'address')
        }),
        ('Площади', {
            'fields': (
                ('total_area_from', 'total_area_to'),
                ('living_area_from', 'living_area_to'),
                ('kitchen_area_from', 'kitchen_area_to')
            )
        }),
        ('Этажность', {
            'fields': (
                ('floor_from', 'floor_to'),
                ('total_floors_from', 'total_floors_to')
            )
        }),
        ('Характеристики', {
            'fields': ('rooms', 'bathroom_type', 'view')
        }),
        ('Цена и условия', {
            'fields': ('price', 'deal_type', 'deposit', 'utilities', 'bargain')
        }),
        ('Описание', {
            'fields': ('description', 'features')
        }),
        ('Системные поля', {
            'fields': ('is_active', 'created_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(ApartmentImage)
class ApartmentImageAdmin(admin.ModelAdmin):
    list_display = ['apartment', 'image']
    list_filter = ['apartment__property_type', 'apartment__status']
    search_fields = ['apartment__address']
