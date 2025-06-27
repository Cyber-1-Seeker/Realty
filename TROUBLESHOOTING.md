# Устранение проблем с 502 Bad Gateway

## Проблема
После изменения nginx.conf и entrypoint.prod.sh ссылки к бэкенду не работают, возвращается 502 Bad Gateway.

## Исправления

### 1. Исправлен nginx.conf
- Убран жестко заданный `server_name 147.45.224.189`
- Добавлен маршрут для админки Django `/admin/`
- Исправлены пути к API `/api/`
- Добавлен health check endpoint `/health/`
- **Добавлены регулярные выражения для более точной маршрутизации**

### 2. Исправлен entrypoint.prod.sh
- Добавлено логирование
- Улучшена обработка ошибок
- Добавлены таймауты для Gunicorn
- **Убрано автосоздание суперпользователя** (см. ADMIN_SETUP.md)

### 3. Исправлены настройки Django (settings.py)
- Исправлен `BASE_DIR` (теперь указывает на корень проекта)
- Добавлены разрешенные хосты для продакшена
- Улучшены CORS настройки

### 4. Исправлен docker-compose.prod.yml
- Добавлены volumes для frontend (статические файлы)
- Добавлен health check для backend
- Добавлена зависимость frontend от backend

### 5. Исправлен frontend/nginx.conf
- Убран жестко заданный server_name
- Добавлены таймауты для proxy
- Исправлены пути к статическим файлам
- **Добавлены регулярные выражения для точной маршрутизации**
- **Добавлен редирект с /admin на /admin/**

## Проблема с React Router и /admin/

### Симптомы
```
index-CBHwREsF.js:7275 No routes matched location "/admin/"
```

### Причина
React Router пытается обработать маршрут `/admin/` как SPA маршрут, но этот маршрут должен обрабатываться Django backend.

### Решение
1. **Исправлена конфигурация nginx** - добавлены регулярные выражения для точной маршрутизации
2. **Изменен порядок location блоков** - специфичные маршруты (admin, api) обрабатываются раньше общего маршрута `/`
3. **Добавлен редирект** с `/admin` на `/admin/`

### Проверка
```bash
# Тестирование nginx конфигурации
./test_nginx.sh

# Проверка админки
curl -I http://localhost/admin/
```

## Проблема со статическими файлами Django

### Симптомы
```
GET http://147.45.224.189/static/admin/css/base.css/ 403 (Forbidden)
GET http://147.45.224.189/static/admin/css/dashboard.css/ net::ERR_ABORTED 403 (Forbidden)
```

### Причина
Nginx не может получить доступ к статическим файлам Django из-за неправильных путей или прав доступа.

### Решение
1. **Исправлены пути в nginx конфигурации** - добавлены регулярные выражения `$1` для правильной обработки путей
2. **Добавлены права доступа** - volumes монтируются с правами только для чтения `:ro`
3. **Улучшен сбор статических файлов** - добавлен скрипт для принудительного сбора

### Проверка
```bash
# Проверка статических файлов
./check_static.sh

# Исправление статических файлов
./fix_static.sh
```

### Ручное исправление
```bash
# Сбор статических файлов
docker exec -it $(docker ps -q --filter "ancestor=sensh1/realty-app:backend-latest") python manage.py collectstatic --noinput --clear

# Проверка файлов в backend
docker exec -it $(docker ps -q --filter "ancestor=sensh1/realty-app:backend-latest") ls -la /app/staticfiles/

# Проверка файлов в frontend
docker exec -it $(docker ps -q --filter "ancestor=sensh1/realty-app:frontend-latest") ls -la /app/staticfiles/

# Тестирование через HTTP
curl -I http://localhost/static/admin/css/base.css
```

## Команды для проверки

### Проверка статуса контейнеров
```bash
docker ps
```

### Проверка логов backend
```bash
docker logs $(docker ps -q --filter "ancestor=sensh1/realty-app:backend-latest")
```

### Проверка логов frontend
```bash
docker logs $(docker ps -q --filter "ancestor=sensh1/realty-app:frontend-latest")
```

### Проверка endpoints
```bash
# Health check
curl http://localhost/health/

# API
curl http://localhost/api/accounts/me/

# Admin
curl http://localhost/admin/
```

## Перезапуск сервисов

```bash
# Остановить все контейнеры
docker-compose -f docker-compose.prod.yml down

# Удалить volumes (если нужно)
docker-compose -f docker-compose.prod.yml down -v

# Пересобрать образы
docker-compose -f docker-compose.prod.yml build

# Запустить
docker-compose -f docker-compose.prod.yml up -d

# Проверить статус
docker-compose -f docker-compose.prod.yml ps
```

## Создание суперпользователя

Для создания суперпользователя в админке Django см. файл `ADMIN_SETUP.md`

## Возможные проблемы

### 1. Переменные окружения
Убедитесь, что файл `backend/.env.production` существует и содержит правильные настройки:
- `SECRET_KEY`
- `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`
- `ALLOWED_HOSTS`
- `CORS_ALLOWED_ORIGINS`

### 2. База данных
Проверьте, что база данных доступна:
```bash
docker exec -it $(docker ps -q --filter "name=db") psql -U $POSTGRES_USER -d $POSTGRES_DB
```

### 3. Статические файлы
Проверьте, что статические файлы собраны:
```bash
docker exec -it $(docker ps -q --filter "ancestor=sensh1/realty-app:backend-latest") python manage.py collectstatic --noinput
```

### 4. Миграции
Проверьте, что миграции применены:
```bash
docker exec -it $(docker ps -q --filter "ancestor=sensh1/realty-app:backend-latest") python manage.py migrate
```

### 5. Nginx конфигурация
Проверьте nginx конфигурацию:
```bash
docker exec -it $(docker ps -q --filter "ancestor=sensh1/realty-app:frontend-latest") nginx -t
```

## Логи для отладки

### Backend логи
```bash
docker logs -f $(docker ps -q --filter "ancestor=sensh1/realty-app:backend-latest")
```

### Frontend логи
```bash
docker logs -f $(docker ps -q --filter "ancestor=sensh1/realty-app:frontend-latest")
```

### Nginx логи
```bash
docker exec -it $(docker ps -q --filter "ancestor=sensh1/realty-app:frontend-latest") tail -f /var/log/nginx/error.log
``` 