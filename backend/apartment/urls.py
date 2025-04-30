from django.urls import path
from .views import ApartmentListAPIView

urlpatterns = [
    path('apartments/', ApartmentListAPIView.as_view(), name='apartments')
]