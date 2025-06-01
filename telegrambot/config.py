import os
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
env_path = BASE_DIR / '.env'

load_dotenv(dotenv_path=env_path)

BOT_TOKEN = os.getenv('BOT_TOKEN')
WEBHOOK_TOKEN = os.getenv('WEBHOOK_TOKEN')
API_URL = os.getenv('API_URL')
API_TOKEN = os.getenv('API_TOKEN')

if not BOT_TOKEN or not API_URL or not API_TOKEN:
    raise Exception("Проверь .env — отсутствует BOT_TOKEN или API_URL")
