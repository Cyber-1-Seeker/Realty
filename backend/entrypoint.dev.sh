#!/bin/sh
set -e

# Создаем директорию для логов (на случай, если она не создана)
mkdir -p /app/backend/logs

# Запуск миграций и статических файлов
python manage.py migrate --noinput
python manage.py collectstatic --noinput --clear

# Запуск Gunicorn
exec gunicorn --bind 0.0.0.0:8000 --workers 3 --access-logfile - config.wsgi:application