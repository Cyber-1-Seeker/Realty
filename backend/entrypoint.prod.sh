#!/bin/sh
set -e

# Применение миграций
python manage.py migrate --noinput

# Сбор статики
python manage.py collectstatic --noinput --clear

# Запуск Gunicorn
exec gunicorn --bind 0.0.0.0:8000 --workers 3 --access-logfile - config.wsgi:application