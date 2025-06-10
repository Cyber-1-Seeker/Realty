from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import ApplicationViewSet, NotifyUsersView,test_telegram_connection

router = DefaultRouter()
router.register(r'applications', ApplicationViewSet, basename='application')

urlpatterns = [
    path('notify-users/', NotifyUsersView.as_view(), name='notify-users'),
    path('test-telegram/', test_telegram_connection, name='test-telegram'),  # Новый эндпоинт
]

urlpatterns += router.urls
