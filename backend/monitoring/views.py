from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from datetime import timedelta, date
from .models import DailyStats


class DailyAnalyticsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        # Получаем параметры
        period = request.GET.get('period', 'week')
        metric = request.GET.get('type', 'visits')

        today = date.today()

        # Выбираем дату начала по периоду
        if period == 'day':
            start_date = today
        elif period == 'week':
            start_date = today - timedelta(days=6)
        elif period == 'month':
            start_date = today - timedelta(days=29)
        elif period == 'year':
            start_date = today - timedelta(days=364)
        else:
            return Response({"error": "Неверный параметр 'period'"}, status=400)

        # Валидные метрики
        valid_metrics = ['visits', 'new_visits', 'new_registers', 'new_applications']
        if metric not in valid_metrics:
            return Response({"error": "Неверный параметр 'type'"}, status=400)

        # Загружаем записи
        stats = DailyStats.objects.filter(date__gte=start_date, date__lte=today).order_by('date')

        # Формируем список и считаем сумму
        data = []
        total = 0

        for stat in stats:
            value = getattr(stat, metric, 0)
            total += value
            data.append({
                "date": stat.date.strftime("%Y-%m-%d"),
                "value": value
            })

        return Response({
            "total": total,
            "data": data
        })
