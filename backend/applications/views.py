from rest_framework import generics
from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from django.views.decorators.csrf import csrf_exempt
from .models import Application
from .serializers import ApplicationSerializer
from django.utils.decorators import method_decorator
from django_ratelimit.decorators import ratelimit
from rest_framework import status


@method_decorator(ratelimit(key='ip', rate='5/m', method='POST', block=True), name='dispatch')
class ApplicationListCreateView(generics.ListCreateAPIView):
    queryset = Application.objects.all().order_by('-created_at')
    serializer_class = ApplicationSerializer

    def create(self, request, *args, **kwargs):
        # Honeypot проверка
        if request.data.get('nickname'):
            return Response({"detail": "Спам обнаружен."}, status=status.HTTP_403_FORBIDDEN)

        return super().create(request, *args, **kwargs)

@method_decorator(csrf_exempt, name='dispatch')
class ApplicationViewSet(viewsets.ModelViewSet):
    queryset = Application.objects.all().order_by('-created_at')
    serializer_class = ApplicationSerializer
    permission_classes = [AllowAny]  # 👈 разрешаем всем временно
