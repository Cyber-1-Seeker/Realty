import os.path
import uuid

from django.db import models
from django.db.models.signals import post_delete
from django.dispatch import receiver

from accounts.models import CustomUser


# Генерация уникального имени файла
def apartment_image_upload_path(instance, filename):
    ext = filename.split('.')[-1]
    filename = f"{uuid.uuid4().hex}.{ext}"
    return os.path.join('apartment_images', filename)


# Create your models here.
class Apartment(models.Model):
    PROPERTY_TYPES = [
        ('apartment', 'Квартира'),
        ('apartments', 'Апартаменты'),
        ('studio', 'Студия'),
    ]

    BATHROOM_TYPES = [
        ('separate', 'Раздельный'),
        ('combined', 'Совмещенный'),
    ]

    RENOVATION_TYPES = [
        ('rough', 'Черновая'),
        ('clean', 'Чистовая'),
        ('euro', 'Евроремонт'),
        ('design', 'Дизайнерский'),
    ]

    VIEW_TYPES = [
        ('yard', 'Двор'),
        ('street', 'Улица'),
        ('park', 'Парк'),
    ]

    DEAL_TYPES = [
        ('sale', 'Продажа'),
        ('rent', 'Аренда'),
    ]

    owner = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='apartments')
    property_type = models.CharField(max_length=20, choices=PROPERTY_TYPES, default='apartment')
    address = models.CharField(max_length=255)
    total_area = models.DecimalField(max_digits=6, decimal_places=2, verbose_name='Общая площадь (м²)')
    living_area = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True,
                                      verbose_name='Жилая площадь (м²)')
    kitchen_area = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True,
                                       verbose_name='Площадь кухни (м²)')
    floor = models.PositiveIntegerField(verbose_name='Этаж')
    total_floors = models.PositiveIntegerField(verbose_name='Этажность дома')
    rooms = models.PositiveIntegerField(verbose_name='Количество комнат')
    bathroom_type = models.CharField(max_length=20, choices=BATHROOM_TYPES, default='combined', verbose_name='Санузел')
    renovation = models.CharField(max_length=20, choices=RENOVATION_TYPES, default='clean', verbose_name='Ремонт')
    balcony = models.PositiveIntegerField(default=0, verbose_name='Количество балконов/лоджий')
    view = models.CharField(max_length=20, choices=VIEW_TYPES, default='yard', verbose_name='Вид из окна')
    construction_year = models.PositiveIntegerField(null=True, blank=True, verbose_name='Год постройки')
    last_renovation_year = models.PositiveIntegerField(null=True, blank=True, verbose_name='Год ремонта')
    price = models.PositiveIntegerField(verbose_name='Цена')
    deal_type = models.CharField(max_length=20, choices=DEAL_TYPES, default='sale', verbose_name='Тип сделки')
    deposit = models.PositiveIntegerField(null=True, blank=True, verbose_name='Залог (для аренды)')
    utilities = models.CharField(max_length=100, null=True, blank=True, verbose_name='Коммунальные платежи')
    bargain = models.BooleanField(default=False, verbose_name='Возможен торг')
    title = models.CharField(max_length=55, verbose_name='Заголовок объявления')
    description = models.TextField(verbose_name='Описание')
    features = models.TextField(null=True, blank=True, verbose_name='Особенности')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Квартира'
        verbose_name_plural = 'Квартиры'
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.title} - {self.address}'


class ApartmentImage(models.Model):
    apartment = models.ForeignKey('Apartment', related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to=apartment_image_upload_path, null=True, blank=True)

    def __str__(self):
        return f'Image for {self.apartment.address}'


# Автоматическое удаление файла при удалении объекта
@receiver(post_delete, sender=ApartmentImage)
def delete_apartment_image(sender, instance, **kwargs):
    """Удаление файла изображения при удалении объекта ApartmentImage"""
    if instance.image and os.path.isfile(instance.image.path):
        os.remove(instance.image.path)
