from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager, PermissionsMixin


# Create your models here.

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
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=20, unique=True)
    first_name = models.CharField(max_length=150)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['phone_number', 'first_name']

    def __str__(self):
        return self.email
