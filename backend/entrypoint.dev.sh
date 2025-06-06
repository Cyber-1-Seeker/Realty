#!/bin/sh
set -e

# Создаем директории
mkdir -p /app/logs
chmod 777 /app/logs

# Миграции и статика
python manage.py migrate --noinput
python manage.py collectstatic --noinput --clear

# Запуск Gunicorn с абсолютным путем
exec /usr/local/bin/gunicorn --bind 0.0.0.0:8000 --workers 3 config.wsgi:application