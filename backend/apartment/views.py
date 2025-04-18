from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import ApartmentSerializer
from .models import Apartment
# Create your views here.


class ApartmentListAPIView(APIView):
    def get(self, request):
        apartments = Apartment.objects.all()
        serializer = ApartmentSerializer(apartments, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ApartmentSerializer(data=request.data)
        print(f'request.data:{request.data}')
        print(f'serializer:{serializer}')
        if serializer.is_valid():
            serializer.save()
            print(f'serializer.data:{serializer.data}')
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)