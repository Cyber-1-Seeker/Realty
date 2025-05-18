from rest_framework import serializers
from .models import Apartment, ApartmentImage


class ApartmentImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ApartmentImage
        fields = ['id', 'image']


class ApartmentSerializer(serializers.ModelSerializer):
    images = ApartmentImageSerializer(many=True, read_only=True)
    owner = serializers.SerializerMethodField()

    def get_owner(self, obj):
        return {
            "name": obj.owner.first_name,
            "phone": obj.owner.phone_number,
            "email": obj.owner.email,
        }

    class Meta:
        model = Apartment
        fields = '__all__'
        read_only_fields = ["id", "created_at", "owner"]
