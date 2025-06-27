#!/bin/sh
set -e

echo "Starting Django application..."

# Создаем директории если их нет
mkdir -p /app/logs
mkdir -p /app/staticfiles
mkdir -p /app/media

# Миграции
echo "Running migrations..."
python manage.py migrate --noinput

# Собираем статические файлы
echo "Collecting static files..."
python manage.py collectstatic --noinput --clear

echo "Starting Gunicorn..."
exec gunicorn --bind 0.0.0.0:8000 --workers 3 --timeout 120 --access-logfile - --error-logfile - config.wsgi:application