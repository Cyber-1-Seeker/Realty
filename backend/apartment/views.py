from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.generics import RetrieveAPIView
from rest_framework.decorators import api_view, permission_classes

from .serializers import ApartmentSerializer
from .models import Apartment, ApartmentImage


# Create your views here.


class ApartmentListAPIView(APIView):
    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAuthenticated()]  # Только авторизованным
        return [AllowAny()]  # GET доступен всем

    def get(self, request):
        user = request.user
        if user.is_authenticated and user.is_staff:
            apartments = Apartment.objects.all()
        else:
            apartments = Apartment.objects.filter(is_active=True)

        serializer = ApartmentSerializer(apartments, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ApartmentSerializer(data=request.data)
        if serializer.is_valid():
            apartment = serializer.save(owner=request.user)

            # Сохраняем изображения
            for image in request.FILES.getlist('images'):
                ApartmentImage.objects.create(apartment=apartment, image=image)

            return Response(ApartmentSerializer(apartment).data, status=status.HTTP_201_CREATED)
        print("ERRORS:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ApartmentDetailAPIView(RetrieveAPIView):
    queryset = Apartment.objects.all()
    serializer_class = ApartmentSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        apartment = super().get_object()
        user = self.request.user

        if apartment.is_active:
            return apartment

        if user.is_authenticated and (user.is_staff or apartment.owner == user):
            return apartment

        from rest_framework.exceptions import PermissionDenied
        raise PermissionDenied("Недостаточно прав для просмотра этого объявления.")


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def toggle_active(request, pk):
    try:
        apartment = Apartment.objects.get(pk=pk, owner=request.user)
    except Apartment.DoesNotExist:
        return Response({'error': 'Not found'}, status=404)

    is_active = request.data.get('is_active')
    if isinstance(is_active, bool):
        apartment.is_active = is_active
        apartment.save()
        return Response({'status': 'updated', 'is_active': apartment.is_active})

    return Response({'error': 'Invalid data'}, status=400)
