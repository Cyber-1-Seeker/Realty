from django.urls import path
from .views import ApartmentListAPIView, ApartmentDetailAPIView, toggle_active

urlpatterns = [
    path('apartments/', ApartmentListAPIView.as_view(), name='apartments'),
    path('apartments/<int:pk>/', ApartmentDetailAPIView.as_view(), name='apartment-detail'),
    path('apartments/<int:pk>/toggle_active/', toggle_active),
]
