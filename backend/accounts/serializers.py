from django.core.cache import cache
from django.db import IntegrityError
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from .models import CustomUser, PhoneConfirmation
import random
import uuid
import time
from .utils import send_sms_exolve


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['email', 'phone_number', 'first_name']

    def create(self, validated_data):
        user = CustomUser(**validated_data)
        user.set_unusable_password()  # ← теперь пароль не нужен
        user.save()
        return user


class PhoneConfirmationRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()
    phone = serializers.CharField()
    first_name = serializers.CharField()

    def validate_email(self, value):
        if CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("Этот email уже используется")
        return value

    def validate_phone(self, value):
        if CustomUser.objects.filter(phone_number=value).exists():
            raise serializers.ValidationError("Этот номер уже зарегистрирован")
        if not value.startswith("+7"):
            raise serializers.ValidationError("Введите номер в формате +7...")
        return value

    def create(self, validated_data):
        phone = validated_data["phone"]
        ip = self.context['request'].META.get('REMOTE_ADDR', '')

        phone_minute_key = f"sms_rate:{phone}:1min"
        phone_hour_key = f"sms_rate:{phone}:hour"
        ip_hour_key = f"sms_rate:ip:{ip}:hour"

        # Проверка лимита в минуту
        if cache.get(phone_minute_key):
            raise ValidationError("Можно отправлять код только раз в минуту")

        # Проверка лимита 5 в час по номеру
        phone_hour_count = cache.get(phone_hour_key) or 0
        if phone_hour_count >= 5:
            raise ValidationError("Превышен лимит отправок кода на этот номер")

        # Проверка лимита 5 в час по IP
        ip_hour_count = cache.get(ip_hour_key) or 0
        if ip_hour_count >= 5:
            raise ValidationError("Превышен лимит отправок с этого IP")

        # Всё ок — отправляем
        code = str(random.randint(1000, 9999))
        print(code)
        token = uuid.uuid4()

        confirmation = PhoneConfirmation.objects.create(
            token=token,
            phone=phone,
            code=code,
            email=validated_data["email"],
            first_name=validated_data["first_name"],
        )

        # Отправка SMS через Exolve
        try:
            send_sms_exolve(phone, f"Код подтверждения: {code}")
        except Exception as e:
            print(f"Ошибка отправки SMS: {e}")
            raise ValidationError("Ошибка отправки SMS. Попробуйте позже.")

        # Ставим флаги в кеш
        cache.set(phone_minute_key, True, timeout=60)  # 1 минута
        cache.set(phone_hour_key, phone_hour_count + 1, timeout=3600)
        cache.set(ip_hour_key, ip_hour_count + 1, timeout=3600)

        return confirmation


class PhoneCodeVerificationSerializer(serializers.Serializer):
    token = serializers.UUIDField()
    code = serializers.CharField()

    def validate(self, data):
        try:
            obj = PhoneConfirmation.objects.get(token=data['token'])
        except PhoneConfirmation.DoesNotExist:
            raise serializers.ValidationError("Неверный токен")

        if obj.code != data["code"]:
            raise serializers.ValidationError("Неверный код")

        if obj.is_expired():
            obj.delete()
            raise serializers.ValidationError("Код истёк")

        # Создание пользователя с отключенным паролем
        user = CustomUser(
            email=obj.email,
            phone_number=obj.phone,
            first_name=obj.first_name
        )
        user.set_unusable_password()
        user.save()

        obj.delete()
        return {"user": user}


class UserListSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'first_name', 'email', 'phone_number', 'is_active', 'is_staff', 'role', 'telegram_id']
        read_only_fields = ['is_staff', 'email', 'phone_number']

    def update(self, instance, validated_data):
        request = self.context.get('request')

        # Запрещаем изменять свой аккаунт
        # if request and instance.id == request.user.id:
        #     raise serializers.ValidationError(
        #         {"detail": "Вы не можете изменять свой аккаунт"}
        #     )

        # Обновляем ВСЕ доступные поля
        for field, value in validated_data.items():
            # Разрешаем обновление только определенных полей
            if field in ['role', 'is_active', 'telegram_id']:
                # Проверка прав для защищенных полей
                if field in ['role', 'is_active']:
                    if not (request and request.user.role == 'admin'):
                        raise serializers.ValidationError({
                            field: "Только администраторы могут изменять это поле"
                        })

                setattr(instance, field, value)

        try:
            instance.save()
            return instance
        except IntegrityError as e:
            if 'telegram_id' in str(e):
                raise serializers.ValidationError({
                    "telegram_id": "Этот Telegram ID уже используется другим пользователем"
                })
            raise e

        # # Только админы могут менять роли
        # if 'role' in validated_data:
        #     if not (request and request.user.role == 'admin'):
        #         raise serializers.ValidationError({
        #             "role": "Только администраторы могут изменять роли пользователей"
        #         })
        #
        # # Только админы могут деактивировать пользователей
        # if 'is_active' in validated_data:
        #     if not (request and request.user.role == 'admin'):
        #         raise serializers.ValidationError({
        #             "is_active": "Только администраторы могут деактивировать пользователей"
        #         })
