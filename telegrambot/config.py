import os
from pathlib import Path
from dotenv import load_dotenv

# Определяем базовый путь - корень проекта
BASE_DIR = Path(__file__).resolve().parent  # Поднимаемся на уровень вверх

# Определяем режим работы по переменной APP_ENV
app_env = os.getenv('APP_ENV', 'development')
is_production = app_env == 'production'

# Выбираем нужный .env файл
env_file = '.env.production' if is_production else '.env'
env_path = BASE_DIR / env_file

# Проверяем существование файла
if not env_path.exists():
    raise FileNotFoundError(f"Файл окружения не найден: {env_path}")

# Загружаем переменные
load_dotenv(dotenv_path=env_path, override=True)

# Получаем значения
BOT_TOKEN = os.getenv('BOT_TOKEN')
WEBHOOK_TOKEN = os.getenv('WEBHOOK_TOKEN')
API_URL = os.getenv('API_URL')
API_TOKEN = os.getenv('API_TOKEN')

# Проверка обязательных переменных
required_vars = {
    'BOT_TOKEN': BOT_TOKEN,
    'API_URL': API_URL,
    'API_TOKEN': API_TOKEN
}

# Автоматическая коррекция URL для production
if is_production and API_URL and API_URL.startswith('http://'):
    # Для внутреннего общения между контейнерами используем HTTP
    if 'backend' in API_URL or 'localhost' in API_URL:
        print(f"ВНИМАНИЕ: Используем HTTP для внутреннего общения: {API_URL}")
    else:
        API_URL = API_URL.replace('http://', 'https://', 1)
        print(f"ВНИМАНИЕ: API_URL изменен на HTTPS: {API_URL}")
