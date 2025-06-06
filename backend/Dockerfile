# Мульти-стадийная сборка
FROM python:3.11-slim-bullseye as builder

# Установка системных зависимостей
RUN apt-get update && apt-get install -y gcc libpq-dev && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Копируем requirements.txt
COPY requirements.txt .

# Установка зависимостей в системную область
RUN pip install --no-cache-dir -r requirements.txt

# Копирование исходного кода
COPY . .

# Стадия выполнения
FROM python:3.11-slim-bullseye as runner

# Установка runtime зависимостей
RUN apt-get update && apt-get install -y libpq5 && rm -rf /var/lib/apt/lists/*

# ЯВНАЯ УСТАНОВКА GUNICORN
RUN pip install --no-cache-dir gunicorn==21.2.0

WORKDIR /app

# Копируем установленные зависимости
COPY --from=builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

# Копируем код приложения
COPY --from=builder /app /app

# Настройка окружения
ENV PYTHONPATH=/app \
    PATH="/usr/local/bin:${PATH}" \
    PYTHONUNBUFFERED=1 \
    DJANGO_SETTINGS_MODULE=config.settings

# Создаем необходимые директории
RUN mkdir -p /app/logs /app/staticfiles /app/media
RUN chmod -R a+w /app/logs

# Команда для запуска
CMD ["sh", "/app/entrypoint.dev.sh"]