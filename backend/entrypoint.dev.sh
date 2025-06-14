#!/bin/sh
set -e

# Создаем директории
mkdir -p /app/logs
chmod 777 /app/logs

# Миграции и статика
python manage.py migrate --noinput
# Только в Docker окружении создаем статические файлы
if [ "$DOCKER_ENV" = "true" ]; then
    python manage.py collectstatic --noinput --clear
fi
# Запуск Gunicorn с абсолютным путем
exec /usr/local/bin/gunicorn --bind 0.0.0.0:8000 --workers 3 config.wsgi:application