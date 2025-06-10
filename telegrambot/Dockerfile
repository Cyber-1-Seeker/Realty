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



FROM python:3.11-slim-bullseye

# Установка зависимостей
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app/telegrambot

# Копируем зависимости
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Копируем код бота
COPY . /app

ENV PYTHONPATH=/app \
    PATH="/usr/local/bin:${PATH}" \
    PYTHONUNBUFFERED=1

# Команда запуска
CMD ["python", "/app/telegrambot/bot.py"]