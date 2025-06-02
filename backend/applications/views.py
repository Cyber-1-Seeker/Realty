from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.authentication import TokenAuthentication, SessionAuthentication
from django.utils.decorators import method_decorator
from django_ratelimit.decorators import ratelimit
from django.conf import settings
from datetime import date
import httpx
from .models import Application
from .serializers import ApplicationSerializer
from monitoring.models import DailyStats
from accounts.permissions import CanViewApplications
from accounts.models import CustomUser


@method_decorator(
    ratelimit(key='ip', rate='5/m', method='POST', block=True),
    name='create'
)
class ApplicationViewSet(viewsets.ModelViewSet):
    queryset = Application.objects.all().order_by('-created_at')
    serializer_class = ApplicationSerializer
    authentication_classes = [SessionAuthentication, TokenAuthentication]

    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]  # Любой может отправить заявку
        return [CanViewApplications()]  # Только админы могут смотреть/редактировать

    def create(self, request, *args, **kwargs):
        if request.data.get('nickname'):
            return Response(
                {"detail": "Спам обнаружен."},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        today = date.today()
        stat, _ = DailyStats.objects.get_or_create(date=today)
        stat.new_applications += 1
        stat.save()

        headers = self.get_success_headers(serializer.data)
        if settings.DEBUG:
            try:
                httpx.post(
                    settings.WEBHOOK_URL,
                    json=serializer.data,
                    headers={'X-Token': settings.WEBHOOK_TOKEN},
                    timeout=5
                )
            except Exception as e:
                print(f"Ошибка отправки вебхука: {e}")
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class NotifyUsersView(APIView):
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [CanViewApplications]

    def get(self, request):
        users = CustomUser.objects.filter(
            is_active=True,
            role__in=['moderator', 'manager', 'admin'],
            telegram_id__isnull=False
        ).exclude(telegram_id='').values('id', 'telegram_id', 'first_name', 'role')

        return Response(list(users))