#!/bin/bash

echo "=== Проверка статических файлов Django ==="

# Проверяем, что backend контейнер запущен
echo "1. Проверка статуса backend контейнера:"
docker ps | grep backend

echo ""
echo "2. Проверка статических файлов в backend контейнере:"
docker exec $(docker ps -q --filter "ancestor=sensh1/realty-app:backend-latest") ls -la /app/staticfiles/

echo ""
echo "3. Проверка статических файлов в frontend контейнере:"
docker exec $(docker ps -q --filter "ancestor=sensh1/realty-app:frontend-latest") ls -la /app/staticfiles/

echo ""
echo "4. Проверка admin статических файлов:"
docker exec $(docker ps -q --filter "ancestor=sensh1/realty-app:frontend-latest") ls -la /app/staticfiles/admin/css/ 2>/dev/null || echo "Папка admin/css не найдена"

echo ""
echo "5. Тестирование статических файлов через HTTP:"

echo "   - Admin base.css:"
curl -s -o /dev/null -w "%{http_code}" http://localhost/static/admin/css/base.css && echo " - OK" || echo " - FAILED"

echo "   - Admin dashboard.css:"
curl -s -o /dev/null -w "%{http_code}" http://localhost/static/admin/css/dashboard.css && echo " - OK" || echo " - FAILED"

echo "   - Admin theme.js:"
curl -s -o /dev/null -w "%{http_code}" http://localhost/static/admin/js/theme.js && echo " - OK" || echo " - FAILED"

echo ""
echo "6. Проверка прав доступа к volumes:"
docker exec $(docker ps -q --filter "ancestor=sensh1/realty-app:frontend-latest") ls -la /app/

echo ""
echo "7. Проверка nginx конфигурации:"
docker exec $(docker ps -q --filter "ancestor=sensh1/realty-app:frontend-latest") nginx -t 