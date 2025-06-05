# Мульти-стадийная сборка
FROM python:3.11-slim-bullseye as builder

# Используем зеркало для обхода проблем с временем
RUN sed -i 's/deb.debian.org/mirror.yandex.ru/g' /etc/apt/sources.list && \
    apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Копируем requirements.txt
COPY requirements.txt .

# Установка зависимостей с кэшированием
RUN pip install --no-cache-dir --user -r requirements.txt

# Копирование исходного кода бэкенда
COPY . .

# Стадия выполнения
FROM python:3.11-slim-bullseye as runner

# Установка runtime зависимостей
RUN sed -i 's/deb.debian.org/mirror.yandex.ru/g' /etc/apt/sources.list && \
    apt-get update && apt-get install -y \
    libpq5 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Копирование зависимостей и кода
COPY --from=builder /root/.local /root/.local
COPY --from=builder /app /app

# Настройка окружения
ENV PATH=/root/.local/bin:$PATH \
    PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    DJANGO_SETTINGS_MODULE=config.settings

# Создание директорий для статики и медиа
RUN mkdir -p /app/staticfiles /app/media

# Копирование entrypoint (новый шаг)
COPY backend/entrypoint.prod.sh /app/entrypoint.prod.sh

# Настройка прав и здоровья
RUN chmod +x /app/entrypoint.prod.sh
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost:8000/health/ || exit 1

EXPOSE 8000
ENTRYPOINT ["/app/entrypoint.prod.sh"]