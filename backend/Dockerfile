# Мульти-стадийная сборка для backend
FROM python:3.11-slim-bullseye AS builder

# Используем зеркало для apt и устанавливаем таймауты
RUN sed -i 's/deb.debian.org/mirror.yandex.ru/g' /etc/apt/sources.list && \
    echo 'Acquire::http::Timeout "300";' > /etc/apt/apt.conf.d/99timeout && \
    echo 'Acquire::ftp::Timeout "300";' >> /etc/apt/apt.conf.d/99timeout

# Установка системных зависимостей
RUN apt-get update && \
    apt-get install -y --no-install-recommends gcc libpq-dev python3-dev libc6-dev && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Копируем и устанавливаем зависимости
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Копирование исходного кода
COPY . .

# Стадия выполнения
FROM python:3.11-slim-bullseye AS runner

# Используем зеркало для apt
RUN sed -i 's/deb.debian.org/mirror.yandex.ru/g' /etc/apt/sources.list && \
    echo 'Acquire::http::Timeout "300";' > /etc/apt/apt.conf.d/99timeout && \
    echo 'Acquire::ftp::Timeout "300";' >> /etc/apt/apt.conf.d/99timeout

# Установка runtime зависимостей
RUN apt-get update && \
    apt-get install -y --no-install-recommends libpq5 curl && \
    rm -rf /var/lib/apt/lists/*

# Установка Gunicorn
RUN pip install --no-cache-dir gunicorn==21.2.0

WORKDIR /app

# Копируем зависимости
COPY --from=builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

# Копируем код приложения
COPY --from=builder /app /app

# Настройка окружения
ENV PYTHONPATH=/app \
    PATH="/usr/local/bin:${PATH}" \
    PYTHONUNBUFFERED=1 \
    DJANGO_SETTINGS_MODULE=config.settings

# Создаем директории
RUN mkdir -p /app/logs /app/staticfiles /app/media && \
    chmod -R a+w /app/logs

# Команда запуска
CMD ["sh", "/app/entrypoint.dev.sh"]