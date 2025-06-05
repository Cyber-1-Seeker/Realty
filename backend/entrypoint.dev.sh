#!/bin/sh
set -e

# Запуск встроенного сервера Django
exec python manage.py runserver 0.0.0.0:8000