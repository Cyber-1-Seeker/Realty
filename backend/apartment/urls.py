from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import ApartmentViewSet, AdminApartmentViewSet

router = DefaultRouter()
router.register(r'apartments', ApartmentViewSet, basename='apartment')
router.register(r'admin-apartments', AdminApartmentViewSet, basename='admin-apartment')

urlpatterns = [
    *router.urls,
    path(
        'admin-apartments/<int:pk>/set_status/',
        AdminApartmentViewSet.as_view({'patch': 'set_status'}),
        name='set-status'
    ),
]