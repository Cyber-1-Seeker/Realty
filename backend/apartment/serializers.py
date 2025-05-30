from rest_framework import serializers
from .models import Apartment, ApartmentImage


class ApartmentImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ApartmentImage
        fields = ['id', 'image']


class ApartmentSerializer(serializers.ModelSerializer):
    images = ApartmentImageSerializer(many=True, read_only=True)
    owner = serializers.SerializerMethodField()

    class Meta:
        model = Apartment
        fields = '__all__'
        read_only_fields = ["id", "created_at", "owner", "is_active"]

    def get_owner(self, obj):
        return {
            "name": obj.owner.first_name,
            "phone": obj.owner.phone_number,
            "email": obj.owner.email,
        }

    def create(self, validated_data):
        # Получаем request из контекста
        request = self.context.get('request')
        validated_data['owner'] = request.user

        images_data = request.FILES.getlist('images')
        validated_data.pop('images', None)

        apartment = Apartment.objects.create(**validated_data)

        for image_data in images_data:
            ApartmentImage.objects.create(apartment=apartment, image=image_data)

        return apartment
