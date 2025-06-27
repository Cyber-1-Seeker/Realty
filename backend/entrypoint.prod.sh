#!/bin/sh
set -e

python manage.py migrate --noinput
python manage.py collectstatic --noinput --clear

# Создаем суперпользователя, если он не существует
echo "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.create_superuser('admin', 'admin@example.com', 'admin123') if not User.objects.filter(username='admin').exists() else None" | python manage.py shell

exec gunicorn --bind 0.0.0.0:8000 --workers 3 config.wsgi:application