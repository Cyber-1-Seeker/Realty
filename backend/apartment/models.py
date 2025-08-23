from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.db.models.signals import post_delete
from django.dispatch import receiver
import os
import uuid
from accounts.models import CustomUser


def apartment_image_upload_path(instance, filename):
    ext = filename.split('.')[-1]
    filename = f"{uuid.uuid4().hex}.{ext}"
    return os.path.join('apartment_images', filename)


class Apartment(models.Model):
    STATUS_CHOICES = [
        ('pending', 'На рассмотрении'),
        ('rejected', 'Отклонено'),
        ('approved', 'Принято'),
    ]

    PROPERTY_TYPES = [
        ('apartment', 'Квартира'),
        ('apartments', 'Апартаменты'),
        ('studio', 'Студия'),
        ('house', 'Дом'),
        ('townhouse', 'Таунхаус'),
    ]

    BATHROOM_TYPES = [
        ('separate', 'Раздельный'),
        ('combined', 'Совмещенный'),
        ('multiple', 'Несколько санузлов'),
    ]

    VIEW_TYPES = [
        ('yard', 'Двор'),
        ('street', 'Улица'),
        ('park', 'Парк'),
        ('river', 'Река'),
        ('city', 'Вид на город'),
    ]

    DEAL_TYPES = [
        ('sale', 'Продажа'),
        ('rent', 'Аренда'),
        ('rent_daily', 'Посуточная аренда'),
    ]

    # Основные параметры
    owner = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='apartments')
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'
    )
    rejection_reason = models.TextField(blank=True, null=True, verbose_name='Причина отклонения')
    property_type = models.CharField(max_length=20, choices=PROPERTY_TYPES, default='apartment')
    address = models.CharField(max_length=255, verbose_name='Адрес')

    # Площади - диапазоны
    total_area_from = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        validators=[MinValueValidator(0.01)],
        verbose_name='Общая площадь от (м²)',
        default=0.01
    )
    total_area_to = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        validators=[MinValueValidator(0.01)],
        verbose_name='Общая площадь до (м²)',
        default=0.01
    )
    living_area_from = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        null=True,
        blank=True,
        validators=[MinValueValidator(0.01)],
        verbose_name='Жилая площадь от (м²)'
    )
    living_area_to = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        null=True,
        blank=True,
        validators=[MinValueValidator(0.01)],
        verbose_name='Жилая площадь до (м²)'
    )
    kitchen_area_from = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        null=True,
        blank=True,
        validators=[MinValueValidator(0.01)],
        verbose_name='Площадь кухни от (м²)'
    )
    kitchen_area_to = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        null=True,
        blank=True,
        validators=[MinValueValidator(0.01)],
        verbose_name='Площадь кухни до (м²)'
    )

    # Этаж квартиры - диапазон
    floor_from = models.PositiveIntegerField(
        null=True,
        blank=True,
        verbose_name='Этаж квартиры от',
        help_text="Если вы не знаете точный этаж, укажите диапазон"
    )
    floor_to = models.PositiveIntegerField(
        null=True,
        blank=True,
        verbose_name='Этаж квартиры до',
        help_text="Если вы не знаете точный этаж, укажите диапазон"
    )

    # Этажность дома - диапазон
    total_floors_from = models.PositiveIntegerField(
        null=True,
        blank=True,
        verbose_name='Этажность дома от',
        help_text="Если вы не знаете точную этажность дома, укажите примерный диапазон"
    )
    total_floors_to = models.PositiveIntegerField(
        null=True,
        blank=True,
        verbose_name='Этажность дома до',
        help_text="Если вы не знаете точную этажность дома, укажите примерный диапазон"
    )

    # Количество комнат
    rooms = models.PositiveIntegerField(
        verbose_name='Количество комнат',
        validators=[MinValueValidator(0), MaxValueValidator(1000)],
        default=1
    )

    bathroom_type = models.CharField(
        max_length=20,
        choices=BATHROOM_TYPES,
        default='combined',
        verbose_name='Санузел'
    )
    view = models.CharField(
        max_length=20,
        choices=VIEW_TYPES,
        default='yard',
        verbose_name='Вид из окна'
    )

    # Цена и условия
    price = models.DecimalField(
        max_digits=30,
        decimal_places=2,
        validators=[MinValueValidator(0.01)],
        verbose_name='Цена'
    )
    deal_type = models.CharField(
        max_length=20,
        choices=DEAL_TYPES,
        default='sale',
        verbose_name='Тип сделки'
    )
    deposit = models.DecimalField(
        max_digits=30,
        decimal_places=2,
        null=True,
        blank=True,
        validators=[MinValueValidator(0.01)],
        verbose_name='Залог (для аренды)'
    )
    utilities = models.CharField(
        max_length=100,
        null=True,
        blank=True,
        verbose_name='Коммунальные платежи'
    )
    bargain = models.BooleanField(
        default=False,
        verbose_name='Возможен торг'
    )

    # Описательные поля
    description = models.TextField(
        verbose_name='Описание',
        help_text="Рекомендуемая длина до 500 символов"
    )

    features = models.TextField(
        null=True,
        blank=True,
        verbose_name='Особенности',
        help_text="Ключевые особенности через запятую (до 500 символов)"
    )

    # Системные поля
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Недвижимость'
        verbose_name_plural = 'Объекты недвижимости'
        ordering = ['-created_at']

    def clean(self):
        """Валидация логики диапазонов"""
        from django.core.exceptions import ValidationError
        
        # Проверка этажа квартиры
        if self.floor_from and self.floor_to:
            if self.floor_from < 1:
                raise ValidationError({'floor_from': 'Этаж квартиры не может быть меньше 1'})
            if self.floor_to < self.floor_from:
                raise ValidationError({'floor_to': 'Этаж "до" не может быть меньше этажа "от"'})
        
        # Проверка этажности дома
        if self.total_floors_from and self.total_floors_to:
            if self.total_floors_to < self.total_floors_from:
                raise ValidationError({'total_floors_to': 'Этажность "до" не может быть меньше этажности "от"'})
        
        # Проверка этажа квартиры относительно этажности дома
        if (self.floor_to and self.total_floors_to and 
            self.floor_to > self.total_floors_to):
            raise ValidationError({'floor_to': 'Этаж квартиры не может быть больше этажности дома'})
        
        # Проверка площадей
        if self.total_area_to and self.total_area_from:
            if self.total_area_to < self.total_area_from:
                raise ValidationError({'total_area_to': 'Площадь "до" не может быть меньше площади "от"'})
        
        if self.living_area_to and self.living_area_from:
            if self.living_area_to < self.living_area_from:
                raise ValidationError({'living_area_to': 'Жилая площадь "до" не может быть меньше жилой площади "от"'})
        
        if self.kitchen_area_to and self.kitchen_area_from:
            if self.kitchen_area_to < self.kitchen_area_from:
                raise ValidationError({'kitchen_area_to': 'Площадь кухни "до" не может быть меньше площади кухни "от"'})

    def save(self, *args, **kwargs):
        """Автоматически управляет is_active на основе статуса и валидирует данные"""
        self.clean()
        if self.status in ['pending', 'rejected']:
            self.is_active = False
        super().save(*args, **kwargs)

    def __str__(self):
        return f'{self.address}'


class ApartmentImage(models.Model):
    apartment = models.ForeignKey('Apartment', related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to=apartment_image_upload_path)

    def __str__(self):
        return f'Изображение для {self.apartment.address}'


@receiver(post_delete, sender=ApartmentImage)
def delete_apartment_image(sender, instance, **kwargs):
    if instance.image and os.path.isfile(instance.image.path):
        os.remove(instance.image.path)
