from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied, NotFound

from .models import Apartment, ApartmentImage
from .serializers import ApartmentSerializer, ApartmentImageSerializer
from accounts.permissions import CanEditPublishedApartments


class ApartmentViewSet(viewsets.ModelViewSet):
    queryset = Apartment.objects.all()
    serializer_class = ApartmentSerializer

    def get_permissions(self):
        if self.action in ['create', 'destroy', 'my']:
            return [IsAuthenticated()]
        return [AllowAny()]

    def get_queryset(self):
        if self.action == 'list':
            return Apartment.objects.filter(is_active=True)
        return super().get_queryset()

    def perform_create(self, serializer):
        apartment = serializer.save(owner=self.request.user)
        for image in self.request.FILES.getlist('images'):
            ApartmentImage.objects.create(apartment=apartment, image=image)

    # ДОБАВЛЯЕМ МЕТОД ДЛЯ УДАЛЕНИЯ
    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
        except NotFound:
            return Response({'error': 'Объявление не найдено'}, status=status.HTTP_404_NOT_FOUND)

        # Проверяем, является ли пользователь владельцем
        if instance.owner != request.user:
            return Response(
                {'error': 'Вы не можете удалить это объявление'},
                status=status.HTTP_403_FORBIDDEN
            )

        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

    def perform_destroy(self, instance):
        # Удаляем все связанные изображения
        for image in instance.images.all():
            image.delete()
        instance.delete()

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def my(self, request):
        """Получение квартир текущего пользователя"""
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
    def set_active(self, request, pk=None):
        try:
            apartment = Apartment.objects.get(pk=pk)
        except Apartment.DoesNotExist:
            return Response({'error': 'Not found'}, status=404)

        if apartment.owner != request.user and request.user.role not in ['manager', 'admin', 'moderator']:
            raise PermissionDenied("Вы не можете изменить статус этой квартиры.")

        is_active = request.data.get('is_active')
        if isinstance(is_active, bool):
            apartment.is_active = is_active
            apartment.save()
            return Response({'status': 'updated', 'is_active': apartment.is_active})

        return Response({'error': 'Invalid data'}, status=400)
