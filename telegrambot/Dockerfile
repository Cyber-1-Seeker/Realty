FROM python:3.12-slim

WORKDIR /app

# Копируем зависимости из корня проекта
COPY requirements.txt .  # Изменено: убрали ../

RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Копируем код бота
COPY . .

# Безопасность
RUN adduser --disabled-password --gecos '' botuser && \
    chown -R botuser:botuser /app
USER botuser

CMD ["python", "bot.py"]