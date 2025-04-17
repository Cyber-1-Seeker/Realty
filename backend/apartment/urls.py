from django.urls import path
from .views import ApartmentListAPIView

urlpatterns = [
    path('api/apartments/', ApartmentListAPIView.as_view(), name='apartments')
]