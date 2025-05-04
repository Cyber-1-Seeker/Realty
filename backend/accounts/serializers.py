from rest_framework import serializers
from .models import CustomUser, PhoneConfirmation
from django.contrib.auth.hashers import make_password
import random
import uuid


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['email', 'phone_number', 'first_name']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        return CustomUser.objects.create_user(**validated_data)


class PhoneConfirmationRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()
    phone = serializers.CharField()
    first_name = serializers.CharField()
    password = serializers.CharField(write_only=True, min_length=8)

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
        hashed_password = make_password(validated_data["password"])

        confirmation = PhoneConfirmation.objects.create(
            token=token,
            phone=validated_data["phone"],
            code=code,
            email=validated_data["email"],
            first_name=validated_data["first_name"],
            password=hashed_password,
        )

        # Отправка SMS
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

        # Всё хорошо — создаём пользователя
        user = CustomUser.objects.create_user(
            email=obj.email,
            phone_number=obj.phone,
            first_name=obj.first_name,
            password=obj.password  # уже хешированный
        )
        obj.delete()
        return {"user": user}
