import os
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
env_path = BASE_DIR / '.env'

load_dotenv(dotenv_path=env_path)

BOT_TOKEN = os.getenv('BOT_TOKEN')
ADMIN_CHAT_ID = int(os.getenv('ADMIN_CHAT_ID'))
API_URL = os.getenv('API_URL')

if not BOT_TOKEN or not ADMIN_CHAT_ID or not API_URL:
    raise Exception("Проверь .env — отсутствует BOT_TOKEN, ADMIN_CHAT_ID или API_URL")
