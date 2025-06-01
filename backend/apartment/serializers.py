from rest_framework import serializers
from .models import Apartment, ApartmentImage
from decimal import Decimal
from django.core.files.uploadedfile import InMemoryUploadedFile


class ApartmentImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ApartmentImage
        fields = ['id', 'image']
        read_only_fields = ['id']


class ApartmentSerializer(serializers.ModelSerializer):
    images = ApartmentImageSerializer(many=True, read_only=True)
    owner = serializers.SerializerMethodField()
    status = serializers.CharField(read_only=True)
    rejection_reason = serializers.CharField(read_only=True)

    class Meta:
        model = Apartment
        fields = '__all__'
        read_only_fields = ["id", "created_at", "owner", "is_active", "status", "rejection_reason"]

    def get_owner(self, obj):
        return {
            "name": obj.owner.first_name,
            "phone": obj.owner.phone_number,
            "email": obj.owner.email,
        }

    def to_internal_value(self, data):
        # Преобразуем строки в Decimal для числовых полей
        decimal_fields = ['price', 'deposit', 'total_area', 'living_area', 'kitchen_area']
        for field in decimal_fields:
            if field in data and isinstance(data[field], str):
                data[field] = data[field].replace(' ', '').replace(',', '.')
        return super().to_internal_value(data)

    def validate_price(self, value):
        try:
            value = Decimal(str(value))
            if value <= 0:
                raise serializers.ValidationError("Цена должна быть положительной")
            return value
        except (ValueError, TypeError):
            raise serializers.ValidationError("Введите корректную цену")

    def validate_deposit(self, value):
        if value is not None:
            try:
                value = Decimal(str(value))
                if value <= 0:
                    raise serializers.ValidationError("Залог должен быть положительным")
                return value
            except (ValueError, TypeError):
                raise serializers.ValidationError("Введите корректную сумму залога")
        return None

    def validate_total_area(self, value):
        try:
            value = Decimal(str(value))
            if value <= 0:
                raise serializers.ValidationError("Площадь должна быть положительной")
            return value
        except (ValueError, TypeError):
            raise serializers.ValidationError("Введите корректную площадь")

    def validate_images(self, value):
        if not value and self.context['request'].method == 'POST':
            raise serializers.ValidationError("Загрузите хотя бы одно изображение")
        return value

    def create(self, validated_data):
        request = self.context.get('request')
        validated_data['owner'] = request.user

        # Обработка изображений
        images_data = []
        if 'images' in validated_data:
            images_data = validated_data.pop('images')

        apartment = Apartment.objects.create(**validated_data)

        # Сохранение изображений с проверкой
        for image_data in images_data:
            if isinstance(image_data, InMemoryUploadedFile):
                if image_data.size > 10 * 1024 * 1024:  # 10MB limit
                    continue  # или можно добавить ошибку
                ApartmentImage.objects.create(apartment=apartment, image=image_data)

        return apartment

    def update(self, instance, validated_data):
        # Обработка изображений при обновлении
        if 'images' in validated_data:
            images_data = validated_data.pop('images')
            # Удаляем старые изображения (опционально)
            instance.images.all().delete()
            # Добавляем новые
            for image_data in images_data:
                if isinstance(image_data, InMemoryUploadedFile):
                    ApartmentImage.objects.create(apartment=instance, image=image_data)

        return super().update(instance, validated_data)
