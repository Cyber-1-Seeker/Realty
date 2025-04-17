from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import ApartmentSerializer
from .models import Apartment
# Create your views here.


class ApartmentListAPIView(APIView):
    def get(self, request):
        apartments = Apartment.objects.all()
        serializer = ApartmentSerializer(apartments, many=True)
        return Response(serializer.data)
