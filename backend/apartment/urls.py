from rest_framework.routers import DefaultRouter
from .views import ApartmentViewSet, AdminApartmentViewSet

router = DefaultRouter()
router.register(r'apartments', ApartmentViewSet, basename='apartment')
router.register(r'admin-apartments', AdminApartmentViewSet, basename='admin-apartment')

urlpatterns = router.urls
