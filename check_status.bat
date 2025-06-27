@echo off
echo === Проверка статуса Docker контейнеров ===
docker ps

echo.
echo === Проверка логов backend ===
for /f "tokens=*" %%i in ('docker ps -q --filter "ancestor=sensh1/realty-app:backend-latest"') do docker logs %%i --tail 20

echo.
echo === Проверка логов frontend ===
for /f "tokens=*" %%i in ('docker ps -q --filter "ancestor=sensh1/realty-app:frontend-latest"') do docker logs %%i --tail 20

echo.
echo === Проверка health endpoint ===
curl -f http://localhost/health/ || echo Health endpoint недоступен

echo.
echo === Проверка API endpoint ===
curl -f http://localhost/api/accounts/me/ || echo API endpoint недоступен

echo.
echo === Проверка админки ===
curl -f http://localhost/admin/ || echo Админка недоступна

pause 