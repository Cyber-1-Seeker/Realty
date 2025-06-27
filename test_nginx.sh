#!/bin/bash

echo "=== Тестирование nginx конфигурации ==="

# Проверяем, что nginx контейнер запущен
echo "1. Проверка статуса nginx контейнера:"
docker ps | grep nginx

echo ""
echo "2. Проверка nginx конфигурации:"
docker exec $(docker ps -q --filter "ancestor=sensh1/realty-app:frontend-latest") nginx -t

echo ""
echo "3. Тестирование маршрутов:"

echo "   - Health endpoint:"
curl -s -o /dev/null -w "%{http_code}" http://localhost/health/ && echo " - OK" || echo " - FAILED"

echo "   - Admin endpoint:"
curl -s -o /dev/null -w "%{http_code}" http://localhost/admin/ && echo " - OK" || echo " - FAILED"

echo "   - API endpoint:"
curl -s -o /dev/null -w "%{http_code}" http://localhost/api/accounts/me/ && echo " - OK" || echo " - FAILED"

echo "   - Static files:"
curl -s -o /dev/null -w "%{http_code}" http://localhost/static/admin/css/base.css && echo " - OK" || echo " - FAILED"

echo "   - Frontend:"
curl -s -o /dev/null -w "%{http_code}" http://localhost/ && echo " - OK" || echo " - FAILED"

echo ""
echo "4. Проверка логов nginx:"
docker exec $(docker ps -q --filter "ancestor=sensh1/realty-app:frontend-latest") tail -5 /var/log/nginx/error.log 