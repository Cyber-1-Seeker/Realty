# Мульти-стадийная сборка
FROM python:3.11-slim-bullseye AS builder

# Установка системных зависимостей
RUN apt-get update && \
    apt-get install -y --no-install-recommends gcc libpq-dev python3-dev libc6-dev && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Копируем только requirements.txt сначала для кэширования
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Копируем остальной код
COPY . .

# Финальный образ
FROM python:3.11-slim-bullseye

# Установка runtime зависимостей и curl для health check
RUN apt-get update && \
    apt-get install -y --no-install-recommends libpq5 curl && \
    rm -rf /var/lib/apt/lists/*

# Установка Gunicorn
RUN pip install --no-cache-dir gunicorn==21.2.0

WORKDIR /app

# Копируем зависимости из builder-стадии
COPY --from=builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

# Копируем код приложения
COPY --from=builder /app /app

# Настройка окружения
ENV PYTHONPATH=/app \
    PYTHONUNBUFFERED=1 \
    DJANGO_SETTINGS_MODULE=config.settings

# Копируем entrypoint
COPY entrypoint.prod.sh /app/entrypoint.prod.sh
RUN chmod +x /app/entrypoint.prod.sh

# Точка входа
CMD ["/app/entrypoint.prod.sh"]