from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied, NotFound
from rest_framework.parsers import MultiPartParser, FormParser

from .models import Apartment, ApartmentImage
from .serializers import ApartmentSerializer, ApartmentImageSerializer
from accounts.permissions import CanEditPublishedApartments


class ApartmentViewSet(viewsets.ModelViewSet):
    parser_classes = [MultiPartParser, FormParser]
    queryset = Apartment.objects.all()
    serializer_class = ApartmentSerializer

    def get_permissions(self):
        if self.action in ['create', 'destroy', 'my', 'update', 'partial_update']:
            return [IsAuthenticated()]
        return [AllowAny()]

    def get_queryset(self):
        if self.action == 'list':
            return Apartment.objects.filter(is_active=True)
        return super().get_queryset()

    def create(self, request, *args, **kwargs):
        print("\n=== Поступил запрос на создание ===")
        print("Метод:", request.method)
        print("Пользователь:", request.user)
        print("Данные:", request.data)
        print("Файлы:", request.FILES)

        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)

            print("Данные после сериализации:", serializer.validated_data)

            # Создаем объект
            apartment = serializer.save()

            # Обрабатываем изображения
            if 'images' in request.FILES:
                for image in request.FILES.getlist('images'):
                    ApartmentImage.objects.create(apartment=apartment, image=image)

            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

        except Exception as e:
            print("Ошибка при создании:", str(e))
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            if instance.owner != request.user:
                return Response(
                    {'error': 'Вы не можете удалить это объявление'},
                    status=status.HTTP_403_FORBIDDEN
                )
            self.perform_destroy(instance)
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=False, methods=['get'])
    def my(self, request):
        """Получение квартир текущего пользователя"""
        print("Запрос на получение моих квартир от:", request.user)
        queryset = Apartment.objects.filter(owner=request.user)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class AdminApartmentViewSet(viewsets.ModelViewSet):
    serializer_class = ApartmentSerializer
    permission_classes = [CanEditPublishedApartments]
    queryset = Apartment.objects.all()

    def perform_destroy(self, instance):
        instance.delete()

    @action(detail=True, methods=['patch'])
    def set_status(self, request, pk=None):
        try:
            apartment = Apartment.objects.get(pk=pk)
        except Apartment.DoesNotExist:
            return Response({'error': 'Not found'}, status=404)

        new_status = request.data.get('status')
        rejection_reason = request.data.get('rejection_reason', None)

        if new_status not in ['pending', 'rejected', 'approved']:
            return Response({'error': 'Invalid status'}, status=400)

        # Обновляем статус и причину
        apartment.status = new_status
        if new_status == 'rejected':
            apartment.rejection_reason = rejection_reason
        else:
            apartment.rejection_reason = None

        apartment.save()
        return Response({'status': 'updated', 'current_status': apartment.status})

    @action(detail=True, methods=['patch'])
    def set_active(self, request, pk=None):
        # Оставляем существующую логику, но с проверкой статуса
        apartment = self.get_object()

        if apartment.status != 'approved':
            return Response(
                {'error': 'Cannot activate non-approved apartment'},
                status=400
            )

        is_active = request.data.get('is_active')
        if isinstance(is_active, bool):
            apartment.is_active = is_active
            apartment.save()
            return Response({'status': 'updated', 'is_active': apartment.is_active})

        return Response({'error': 'Invalid data'}, status=400)
