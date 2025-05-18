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
    owner = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='apartment')
    price = models.IntegerField()
    address = models.CharField(max_length=100)
    rooms = models.IntegerField()
    floor = models.IntegerField()
    area = models.DecimalField(max_digits=6, decimal_places=2)
    # image = models.ImageField(upload_to=apartment_image_upload_path, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Квартира'
        verbose_name_plural = 'Квартиры'
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.address}, {self.price}'


class ApartmentImage(models.Model):
    apartment = models.ForeignKey('Apartment', related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to=apartment_image_upload_path, null=True, blank=True)

    def __str__(self):
        return f'Image for {self.apartment.address}'


# Автоматическое удаление файла при удалении объекта
@receiver(post_delete, sender=Apartment)
def delete_apartment_image(sender, instance, **kwargs):
    if instance.image and os.path.isfile(instance.image.path):
        os.remove(instance.image.path)
