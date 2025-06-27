#!/bin/bash

echo "=== Исправление статических файлов Django ==="

# Останавливаем контейнеры
echo "1. Остановка контейнеров..."
docker-compose -f docker-compose.prod.yml down

# Удаляем volumes со статическими файлами
echo "2. Удаление volumes со статическими файлами..."
docker volume rm realty_static_volume realty_media_volume 2>/dev/null || echo "Volumes не найдены"

# Запускаем только backend для сбора статических файлов
echo "3. Запуск backend для сбора статических файлов..."
docker-compose -f docker-compose.prod.yml up -d db
sleep 10

docker-compose -f docker-compose.prod.yml up -d backend
sleep 30

# Проверяем, что backend запустился
echo "4. Проверка статуса backend..."
docker ps | grep backend

# Собираем статические файлы
echo "5. Сбор статических файлов..."
docker exec $(docker ps -q --filter "ancestor=sensh1/realty-app:backend-latest") python manage.py collectstatic --noinput --clear

# Проверяем, что файлы собраны
echo "6. Проверка собранных файлов..."
docker exec $(docker ps -q --filter "ancestor=sensh1/realty-app:backend-latest") ls -la /app/staticfiles/

# Запускаем frontend
echo "7. Запуск frontend..."
docker-compose -f docker-compose.prod.yml up -d frontend

# Проверяем, что frontend запустился
echo "8. Проверка статуса frontend..."
docker ps | grep frontend

# Проверяем статические файлы в frontend
echo "9. Проверка статических файлов в frontend..."
docker exec $(docker ps -q --filter "ancestor=sensh1/realty-app:frontend-latest") ls -la /app/staticfiles/

# Тестируем доступность статических файлов
echo "10. Тестирование статических файлов..."
sleep 10

echo "   - Admin base.css:"
curl -s -o /dev/null -w "%{http_code}" http://localhost/static/admin/css/base.css && echo " - OK" || echo " - FAILED"

echo "   - Admin dashboard.css:"
curl -s -o /dev/null -w "%{http_code}" http://localhost/static/admin/css/dashboard.css && echo " - OK" || echo " - FAILED"

echo ""
echo "=== Готово! ===" 