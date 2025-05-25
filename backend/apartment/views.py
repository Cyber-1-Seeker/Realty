from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied

from .models import Apartment, ApartmentImage
from .serializers import ApartmentSerializer
from accounts.permissions import CanEditPublishedApartments


class ApartmentViewSet(viewsets.ModelViewSet):
    queryset = Apartment.objects.all()
    serializer_class = ApartmentSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [IsAuthenticated()]
        return [AllowAny()]

    def get_queryset(self):
        return Apartment.objects.filter(is_active=True)

    def perform_create(self, serializer):
        apartment = serializer.save(owner=self.request.user)
        for image in self.request.FILES.getlist('images'):
            ApartmentImage.objects.create(apartment=apartment, image=image)


class AdminApartmentViewSet(viewsets.ModelViewSet):
    serializer_class = ApartmentSerializer
    permission_classes = [CanEditPublishedApartments]

    def get_queryset(self):
        user = self.request.user
        return Apartment.objects.all()

    def perform_destroy(self, instance):
        instance.delete()

    @action(detail=True, methods=['patch'], permission_classes=[IsAuthenticated, CanEditPublishedApartments])
    def set_active(self, request, pk=None):
        try:
            apartment = Apartment.objects.get(pk=pk)
        except Apartment.DoesNotExist:
            return Response({'error': 'Not found'}, status=404)

        if apartment.owner != request.user and request.user.role not in ['manager', 'admin']:
            raise PermissionDenied("Вы не можете изменить статус этой квартиры.")

        is_active = request.data.get('is_active')
        if isinstance(is_active, bool):
            apartment.is_active = is_active
            apartment.save()
            return Response({'status': 'updated', 'is_active': apartment.is_active})

        return Response({'error': 'Invalid data'}, status=400)
