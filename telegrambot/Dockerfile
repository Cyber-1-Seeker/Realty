## Мульти-стадийная сборка для telegrambot
#FROM python:3.11-slim-bullseye as builder
#
## Используем зеркало для обхода проблем с временем
#RUN sed -i 's/deb.debian.org/mirror.yandex.ru/g' /etc/apt/sources.list && \
#    apt-get update && apt-get install -y \
#    gcc \
#    libpq-dev \
#    && rm -rf /var/lib/apt/lists/*
#
#WORKDIR /app
#
## Копируем requirements.txt
#COPY requirements.txt .
#
## Установка зависимостей
#RUN pip install --no-cache-dir --user -r requirements.txt
#
## Копирование кода бота
#COPY . .
#
## Стадия выполнения
#FROM python:3.11-slim-bullseye as runner
#
## Установка runtime зависимостей
#RUN sed -i 's/deb.debian.org/mirror.yandex.ru/g' /etc/apt/sources.list && \
#    apt-get update && apt-get install -y \
#    libpq5 \
#    && rm -rf /var/lib/apt/lists/*
#
#WORKDIR /app
#COPY --from=builder /root/.local /root/.local
#COPY --from=builder /app /app
#
#ENV PATH=/root/.local/bin:$PATH \
#    PYTHONUNBUFFERED=1 \
#    APP_ENV=production
#
#ENV PYTHONPATH=/app
#
#HEALTHCHECK --interval=1m --timeout=3s \
#  CMD python -c "import requests; requests.get('http://backend:8000/health', timeout=2)" || exit 1
#
#CMD ["python", "/app/telegrambot/bot.py"]



FROM python:3.11-slim-bullseye AS builder

# Добавляем необходимые системные зависимости для сборки
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    libc6-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app/telegrambot
COPY requirements.txt .

# Устанавливаем зависимости
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Копируем остальной код
COPY . .

# Финальный образ
FROM python:3.11-slim-bullseye

# Устанавливаем runtime-зависимости
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app/telegrambot

# Копируем установленные зависимости и код из builder-стадии
COPY --from=builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=builder /app/telegrambot /app/telegrambot

# Настраиваем окружение
ENV PYTHONPATH=/app \
    PYTHONUNBUFFERED=1

CMD ["python", "bot.py"]