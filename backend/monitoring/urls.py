from django.urls import path
from .views import DailyAnalyticsView

urlpatterns = [
    path('daily/', DailyAnalyticsView.as_view(), name='daily_monitoring')
]
