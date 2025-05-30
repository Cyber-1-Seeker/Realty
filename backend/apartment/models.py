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

    RENOVATION_TYPES = [
        ('rough', 'Черновая'),
        ('clean', 'Чистовая'),
        ('euro', 'Евроремонт'),
        ('design', 'Дизайнерский'),
        ('partial', 'Частичный ремонт'),
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
    property_type = models.CharField(max_length=20, choices=PROPERTY_TYPES, default='apartment')
    address = models.CharField(max_length=255)
    title = models.CharField(max_length=100, verbose_name='Заголовок объявления')

    # Площади
    total_area = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        validators=[MinValueValidator(0.01)],
        verbose_name='Общая площадь (м²)'
    )
    living_area = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        null=True,
        blank=True,
        validators=[MinValueValidator(0.01)],
        verbose_name='Жилая площадь (м²)'
    )
    kitchen_area = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        null=True,
        blank=True,
        validators=[MinValueValidator(0.01)],
        verbose_name='Площадь кухни (м²)'
    )

    # Этажность
    floor = models.PositiveIntegerField(
        null=True,
        blank=True,
        verbose_name='Этаж',
        help_text="Для домов можно оставить пустым"
    )
    total_floors = models.PositiveIntegerField(
        null=True,
        blank=True,
        verbose_name='Этажность дома',
        help_text="Для домов можно оставить пустым"
    )

    # Характеристики
    rooms = models.PositiveIntegerField(
        verbose_name='Количество комнат',
        validators=[MinValueValidator(0), MaxValueValidator(1000)]
    )
    bathroom_type = models.CharField(
        max_length=20,
        choices=BATHROOM_TYPES,
        default='combined',
        verbose_name='Санузел'
    )
    renovation = models.CharField(
        max_length=20,
        choices=RENOVATION_TYPES,
        default='clean',
        verbose_name='Ремонт'
    )
    balcony = models.PositiveIntegerField(
        default=0,
        verbose_name='Количество балконов/лоджий'
    )
    view = models.CharField(
        max_length=20,
        choices=VIEW_TYPES,
        default='yard',
        verbose_name='Вид из окна'
    )

    # Годы
    construction_year = models.PositiveIntegerField(
        null=True,
        blank=True,
        validators=[
            MinValueValidator(1800),
            MaxValueValidator(2100)
        ],
        verbose_name='Год постройки'
    )
    last_renovation_year = models.PositiveIntegerField(
        null=True,
        blank=True,
        validators=[
            MinValueValidator(1800),
            MaxValueValidator(2100)
        ],
        verbose_name='Год ремонта'
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

    def __str__(self):
        return f'{self.title} - {self.address}'


class ApartmentImage(models.Model):
    apartment = models.ForeignKey('Apartment', related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to=apartment_image_upload_path)

    def __str__(self):
        return f'Изображение для {self.apartment.address}'


@receiver(post_delete, sender=ApartmentImage)
def delete_apartment_image(sender, instance, **kwargs):
    if instance.image and os.path.isfile(instance.image.path):
        os.remove(instance.image.path)
