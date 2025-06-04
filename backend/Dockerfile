FROM python:3.12-slim as builder

WORKDIR /app

# Копируем зависимости
COPY requirements.txt .

RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Копируем код бэкенда
COPY . .

# Финальный образ
FROM python:3.12-slim

WORKDIR /app

# Создаем директории для медиа и статики
RUN mkdir -p /app/media /app/staticfiles

COPY --from=builder /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages
COPY --from=builder /app /app

# Установка runtime зависимостей
RUN apt-get update && \
    apt-get install -y libpq5 --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

# Настройки безопасности
RUN adduser --disabled-password --gecos '' appuser && \
    chown -R appuser:appuser /app
USER appuser

EXPOSE 8000
CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000"]