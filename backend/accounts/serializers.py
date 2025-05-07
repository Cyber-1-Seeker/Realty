from rest_framework import serializers
from .models import CustomUser, PhoneConfirmation
import random
import uuid


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
        code = str(random.randint(1000, 9999))
        print(code)
        token = uuid.uuid4()

        confirmation = PhoneConfirmation.objects.create(
            token=token,
            phone=validated_data["phone"],
            code=code,
            email=validated_data["email"],
            first_name=validated_data["first_name"],
        )

        # Отправка SMS (если используешь)
        import requests
        requests.get("https://sms.ru/sms/send", params={
            "api_id": "ТВОЙ_API_КЛЮЧ",
            "to": validated_data["phone"],
            "msg": f"Код подтверждения: {code}",
            "json": 1
        })

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
        fields = ['id', 'first_name', 'email', 'phone_number', 'is_active', 'is_staff']
