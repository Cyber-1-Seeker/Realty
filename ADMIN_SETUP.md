# Создание суперпользователя в контейнере

## Способ 1: Через Django shell

### Подключение к контейнеру
```bash
# Найти ID контейнера backend
docker ps

# Подключиться к контейнеру
docker exec -it realty-backend-1 bash
```

### Создание суперпользователя
```bash
# Внутри контейнера
python manage.py createsuperuser
```

Система запросит:
- Email (обязательно)
- Phone number (обязательно)
- First name (обязательно)
- Password (обязательно)

### Пример создания через shell
```bash
# Альтернативный способ через shell
python manage.py shell

# В Python shell:
from django.contrib.auth import get_user_model
User = get_user_model()
User.objects.create_superuser(
    email='admin@example.com',
    phone_number='+79001234567',
    first_name='Admin',
    password='your-secure-password'
)
```

## Способ 2: Через команду createsuperuser с параметрами

```bash
# В контейнере
python manage.py createsuperuser --email admin@example.com --phone_number +79001234567 --first_name Admin
```

## Способ 3: Через Docker exec напрямую

```bash
# Создать суперпользователя без входа в контейнер
docker exec -it realty-backend-1 python manage.py createsuperuser
```

## Проверка создания

```bash
# Проверить, что суперпользователь создан
python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
superusers = User.objects.filter(is_superuser=True)
for user in superusers:
    print(f'Email: {user.email}, Name: {user.first_name}, Phone: {user.phone_number}')
"
```

## Доступ к админке

После создания суперпользователя вы можете войти в админку по адресу:
```
http://147.45.224.189/admin/
```

Используйте:
- Email: ваш email
- Password: ваш пароль

## Удаление суперпользователя

```bash
# В Django shell
python manage.py shell

# В Python shell:
from django.contrib.auth import get_user_model
User = get_user_model()
user = User.objects.get(email='admin@example.com')
user.delete()
```

## Сброс пароля

```bash
# В Django shell
python manage.py shell

# В Python shell:
from django.contrib.auth import get_user_model
User = get_user_model()
user = User.objects.get(email='admin@example.com')
user.set_password('new-password')
user.save()
``` 