from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager, PermissionsMixin
from django.utils import timezone
import uuid


# Create your models here.
# Модели для аккаунта
class CustomUserManager(BaseUserManager):
    def create_user(self, email, phone_number, first_name, password=None, **extra_fields):
        if not email:
            raise ValueError("Email обязателен")
        if not phone_number:
            raise ValueError("Номер телефона обязателен")
        if not first_name:
            raise ValueError("Имя обязательно")

        email = self.normalize_email(email)
        user = self.model(email=email, phone_number=phone_number, first_name=first_name, **extra_fields)

        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()

        user.save(using=self._db)
        return user

    def create_superuser(self, email, phone_number, first_name, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if not password:
            raise ValueError("Суперпользователь должен иметь пароль.")

        return self.create_user(email, phone_number, first_name, password, **extra_fields)


class CustomUser(AbstractUser, PermissionsMixin):
    ROLE_CHOICES = (
        ('user', 'Пользователь'),
        ('admin', 'Админ'),
        ('manager', 'Менеджер'),
        ('moderator', 'Модератор'),
    )
    username = None
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='user')
    phone_number = models.CharField(max_length=20, unique=True)
    first_name = models.CharField(max_length=150)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['phone_number', 'first_name']

    def __str__(self):
        return self.email


# Ниже будут модели для подтверждения номера телефона
class PhoneConfirmation(models.Model):
    token = models.UUIDField(default=uuid.uuid4, unique=True)
    phone = models.CharField(max_length=20)
    code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)

    # Данные для будушего CustomUser
    email = models.EmailField()
    password = models.CharField() #уже хешированный
    first_name = models.CharField(max_length=150)

    def is_expired(self):
        return timezone.now() > self.created_at + timezone.timedelta(minutes=5)
