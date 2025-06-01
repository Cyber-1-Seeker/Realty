from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import ApplicationViewSet, NotifyUsersView

router = DefaultRouter()
router.register(r'applications', ApplicationViewSet, basename='application')

urlpatterns = [
    path('notify-users/', NotifyUsersView.as_view(), name='notify-users'),
]

urlpatterns += router.urls
