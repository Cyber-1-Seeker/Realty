#!/bin/bash

echo "=== Проверка статуса Docker контейнеров ==="
docker ps

echo ""
echo "=== Проверка логов backend ==="
docker logs $(docker ps -q --filter "ancestor=sensh1/realty-app:backend-latest") --tail 20

echo ""
echo "=== Проверка логов frontend ==="
docker logs $(docker ps -q --filter "ancestor=sensh1/realty-app:frontend-latest") --tail 20

echo ""
echo "=== Проверка health endpoint ==="
curl -f http://localhost/health/ || echo "Health endpoint недоступен"

echo ""
echo "=== Проверка API endpoint ==="
curl -f http://localhost/api/accounts/me/ || echo "API endpoint недоступен"

echo ""
echo "=== Проверка админки ==="
curl -f http://localhost/admin/ || echo "Админка недоступна" 