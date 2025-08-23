from rest_framework import serializers
from .models import Apartment, ApartmentImage
from decimal import Decimal, InvalidOperation
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
        decimal_fields = [
            'price', 'deposit', 
            'total_area_from', 'total_area_to',
            'living_area_from', 'living_area_to',
            'kitchen_area_from', 'kitchen_area_to'
        ]
        
        # Создаем копию данных для изменения
        processed_data = data.copy()
        
        # Отладочная информация
        print(f"DEBUG: Получены данные: {data}")
        
        for field in decimal_fields:
            if field in processed_data:
                value = processed_data[field]
                print(f"DEBUG: Поле {field}: значение={value}, тип={type(value)}")
                
                # Обрабатываем все возможные типы данных
                if isinstance(value, str):
                    # Убираем пробелы и заменяем запятую на точку
                    cleaned_value = value.replace(' ', '').replace(',', '.')
                    try:
                        # Преобразуем в Decimal
                        processed_data[field] = Decimal(cleaned_value)
                        print(f"DEBUG: {field} преобразован в Decimal: {processed_data[field]}")
                    except (ValueError, TypeError, InvalidOperation) as e:
                        # Если не удалось преобразовать, оставляем как есть для дальнейшей валидации
                        print(f"DEBUG: Ошибка преобразования {field}: {e}")
                        processed_data[field] = cleaned_value
                elif isinstance(value, (int, float)):
                    # Если уже число, преобразуем в Decimal
                    try:
                        processed_data[field] = Decimal(str(value))
                        print(f"DEBUG: {field} преобразован в Decimal: {processed_data[field]}")
                    except (ValueError, TypeError, InvalidOperation) as e:
                        print(f"DEBUG: Ошибка преобразования {field}: {e}")
                        pass
                elif value is None:
                    # Если значение None, устанавливаем значение по умолчанию
                    if field in ['total_area_from', 'total_area_to']:
                        processed_data[field] = Decimal('0.01')
                        print(f"DEBUG: {field} установлено значение по умолчанию: 0.01")
                    else:
                        processed_data[field] = None
                else:
                    # Для других типов пытаемся преобразовать в строку и затем в Decimal
                    try:
                        str_value = str(value).replace(' ', '').replace(',', '.')
                        processed_data[field] = Decimal(str_value)
                        print(f"DEBUG: {field} преобразован в Decimal: {processed_data[field]}")
                    except (ValueError, TypeError, InvalidOperation) as e:
                        # Если не удалось, оставляем как есть
                        print(f"DEBUG: Ошибка преобразования {field}: {e}")
                        pass
        
        print(f"DEBUG: Обработанные данные: {processed_data}")
        return super().to_internal_value(processed_data)

    def validate_price(self, value):
        if value <= 0:
            raise serializers.ValidationError("Цена должна быть положительной")
        return value

    def validate_deposit(self, value):
        if value is not None:
            if value <= 0:
                raise serializers.ValidationError("Залог должен быть положительным")
        return value

    def validate_living_area_from(self, value):
        print(f"DEBUG: Валидация living_area_from: значение={value}, тип={type(value)}")
        if value < Decimal('0.01'):
            print(f"DEBUG: living_area_from < 0.01: {value} < {Decimal('0.01')}")
            raise serializers.ValidationError("Жилая площадь должна быть не меньше 0.01 м²")
        print(f"DEBUG: living_area_from валидно: {value}")
        return value

    def validate_living_area_to(self, value):
        print(f"DEBUG: Валидация living_area_from: значение={value}, тип={type(value)}")
        if value < Decimal('0.01'):
            print(f"DEBUG: living_area_to < 0.01: {value} < {Decimal('0.01')}")
            raise serializers.ValidationError("Жилая площадь должна быть не меньше 0.01 м²")
        print(f"DEBUG: living_area_to валидно: {value}")
        return value

    def validate_kitchen_area_from(self, value):
        print(f"DEBUG: Валидация kitchen_area_from: значение={value}, тип={type(value)}")
        if value < Decimal('0.01'):
            print(f"DEBUG: kitchen_area_from < 0.01: {value} < {Decimal('0.01')}")
            raise serializers.ValidationError("Площадь кухни должна быть не меньше 0.01 м²")
        print(f"DEBUG: kitchen_area_from валидно: {value}")
        return value

    def validate_kitchen_area_to(self, value):
        print(f"DEBUG: Валидация kitchen_area_to: значение={value}, тип={type(value)}")
        if value < Decimal('0.01'):
            print(f"DEBUG: kitchen_area_to < 0.01: {value} < {Decimal('0.01')}")
            raise serializers.ValidationError("Площадь кухни должна быть не меньше 0.01 м²")
        print(f"DEBUG: kitchen_area_to валидно: {value}")
        return value

    def validate_total_area_from(self, value):
        print(f"DEBUG: Валидация total_area_from: значение={value}, тип={type(value)}")
        if value < Decimal('0.01'):
            print(f"DEBUG: total_area_from < 0.01: {value} < {Decimal('0.01')}")
            raise serializers.ValidationError("Площадь должна быть не меньше 0.01 м²")
        print(f"DEBUG: total_area_from валидно: {value}")
        return value

    def validate_total_area_to(self, value):
        print(f"DEBUG: Валидация total_area_to: значение={value}, тип={type(value)}")
        if value < Decimal('0.01'):
            print(f"DEBUG: total_area_to < 0.01: {value} < {Decimal('0.01')}")
            raise serializers.ValidationError("Площадь должна быть не меньше 0.01 м²")
        print(f"DEBUG: total_area_to валидно: {value}")
        return value

    def validate(self, data):
        """Валидация логики диапазонов"""
        # Проверка этажа квартиры
        floor_from = data.get('floor_from')
        floor_to = data.get('floor_to')
        if floor_from and floor_to and floor_to < floor_from:
            raise serializers.ValidationError({
                'floor_to': 'Этаж "до" не может быть меньше этажа "от"'
            })
        
        # Проверка этажности дома
        total_floors_from = data.get('total_floors_from')
        total_floors_to = data.get('total_floors_to')
        if total_floors_from and total_floors_to and total_floors_to < total_floors_from:
            raise serializers.ValidationError({
                'total_floors_to': 'Этажность "до" не может быть меньше этажности "от"'
            })

        # Проверка общей площади
        total_area_from = data.get('total_area_from')
        total_area_to = data.get('total_area_to')
        if total_area_from and total_area_to and total_area_to < total_area_from:
            raise serializers.ValidationError({
                'total_area_to': 'Площадь "до" не может быть меньше площади "от"'
            })

        # Проверка жилой площади
        living_area_from = data.get('living_area_from')
        living_area_to = data.get('living_area_to')
        if living_area_from and living_area_to and living_area_to < living_area_from:
            raise serializers.ValidationError({
                'living_area_to': 'Жилая площадь "до" не может быть меньше жилой площади "от"'
            })

        # Проверка площади кухни
        kitchen_area_from = data.get('kitchen_area_from')
        kitchen_area_to = data.get('kitchen_area_to')
        if kitchen_area_from and kitchen_area_to and kitchen_area_to < kitchen_area_from:
            raise serializers.ValidationError({
                'kitchen_area_to': 'Площадь кухни "до" не может быть меньше площади кухни "от"'
            })
        
        # Проверка этажа квартиры относительно этажности дома
        if floor_to and total_floors_to and floor_to > total_floors_to:
            raise serializers.ValidationError({
                'floor_to': 'Этаж квартиры не может быть больше этажности дома'
            })

        # Проверка минимальных значений
        if floor_from and floor_from < 1:
            raise serializers.ValidationError({
                'floor_from': 'Этаж квартиры не может быть меньше 1'
            })
        
        if total_floors_from and total_floors_from < 1:
            raise serializers.ValidationError({
                'total_floors_from': 'Этажность дома не может быть меньше 1'
            })
        
        return data

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
