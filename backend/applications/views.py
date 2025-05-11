from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from django.utils.decorators import method_decorator
from django_ratelimit.decorators import ratelimit
from datetime import date

from .models import Application
from .serializers import ApplicationSerializer
from monitoring.models import DailyStats


@method_decorator(
    ratelimit(key='ip', rate='5/m', method='POST', block=True),
    name='create'
)
class ApplicationViewSet(viewsets.ModelViewSet):
    queryset = Application.objects.all().order_by('-created_at')
    serializer_class = ApplicationSerializer
    permission_classes = [IsAdminUser]  # 🔒 Только админы могут управлять заявками

    def create(self, request, *args, **kwargs):
        # 🛡️ Honeypot — антибот-фильтр
        if request.data.get('nickname'):
            return Response(
                {"detail": "Спам обнаружен."},
                status=status.HTTP_403_FORBIDDEN
            )

        # 🚀 Создаём заявку
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        # 📈 Обновляем статистику
        today = date.today()
        stat, _ = DailyStats.objects.get_or_create(date=today)
        stat.new_applications += 1
        stat.save()

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
