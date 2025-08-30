from django.urls import path
from . import views

app_name = 'monitoring'

urlpatterns = [
    path('daily/', views.DailyAnalyticsView.as_view(), name='daily_monitoring'),
]
