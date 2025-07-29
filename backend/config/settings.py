import os
import sys
from pathlib import Path
from dotenv import load_dotenv
import sys
import httpx

# Определяем базовый путь - корень проекта backend
BASE_DIR = Path(__file__).resolve().parent.parent

# === Загрузка переменных окружения ===
# Определяем режим работы по переменной APP_ENV
app_env = os.getenv('APP_ENV', 'development')
is_production = app_env == 'production'

# Выбираем нужный .env файл
env_file = '.env.production' if is_production else '.env'
env_path = os.path.join(BASE_DIR, env_file)

# Загружаем переменные
load_dotenv(dotenv_path=env_path, override=True)

# === Базовые настройки ===
SECRET_KEY = os.getenv("SECRET_KEY", "insecure-secret")
DEBUG = os.getenv("DEBUG", "False") == "True"

# Вывод информации о конфигурации
print(f"Режим работы: {'PRODUCTION' if is_production else 'DEVELOPMENT'}")
print(f"Используемый файл окружения: {env_path}")
print(f"DEBUG: {DEBUG}")

# Динамические ALLOWED_HOSTS
allowed_hosts = os.getenv("ALLOWED_HOSTS", "")
ALLOWED_HOSTS = allowed_hosts.split(",") if allowed_hosts else []

if DEBUG:
    ALLOWED_HOSTS.extend(['localhost', '127.0.0.1'])
else:
    # Продакшен хосты
    ALLOWED_HOSTS.extend([
        '147.45.224.189',
        'localhost',
        '127.0.0.1',
        'backend',  # Docker service name
        '*',  # Временно разрешаем все хосты для отладки
    ])

# === Конфигурация базы данных ===
if 'test' in sys.argv:
    # Используем SQLite для тестов (для скорости)
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'test_db.sqlite3',
        }
    }
elif DEBUG:
    # Разработка: используем Postgres из .env
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': os.getenv("POSTGRES_DB", "realty_db"),
            'USER': os.getenv("POSTGRES_USER", "postgres"),
            'PASSWORD': os.getenv("POSTGRES_PASSWORD", ""),
            'HOST': os.getenv("DB_HOST", "db"),
            'PORT': '5432',
        }
    }
else:
    # Продакшен: Postgres с оптимизациями
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': os.getenv("POSTGRES_DB", "realty_prod"),
            'USER': os.getenv("POSTGRES_USER", "prod_user"),
            'PASSWORD': os.getenv("POSTGRES_PASSWORD", ""),
            'HOST': os.getenv("DB_HOST", "db"),
            'PORT': '5432',
            'CONN_MAX_AGE': 60,  # Переиспользование соединений
        }
    }

# === Приложения и middleware ===
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'rest_framework',
    'rest_framework.authtoken',
    'corsheaders',

    'apartment',
    'accounts',
    'applications',
    'monitoring',
    'testimonials',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'monitoring.middleware.UserVisitMiddleware',
]

# Отключаем проблемные заголовки безопасности для HTTP
if not DEBUG:
    # Удаляем SecurityMiddleware для отключения автоматических заголовков безопасности
    MIDDLEWARE = [mw for mw in MIDDLEWARE if mw != 'django.middleware.security.SecurityMiddleware']

# === Пути и URL ===
ROOT_URLCONF = 'config.urls'
WSGI_APPLICATION = 'config.wsgi.application'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# === Аутентификация и пароли ===
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

AUTH_USER_MODEL = 'accounts.CustomUser'

# === Интернационализация ===
LANGUAGE_CODE = 'ru-ru'
TIME_ZONE = 'Europe/Moscow'
USE_I18N = True
USE_TZ = True

# === Статика и медиа ===
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')  # Для collectstatic

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# === DRF ===
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework.authentication.TokenAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ]
}

# === CORS и CSRF ===
CORS_ALLOWED_ORIGINS = os.getenv("CORS_ALLOWED_ORIGINS", "").split(",") if os.getenv("CORS_ALLOWED_ORIGINS") else []
CSRF_TRUSTED_ORIGINS = os.getenv("CSRF_TRUSTED_ORIGINS", "").split(",") if os.getenv("CSRF_TRUSTED_ORIGINS") else []

if DEBUG:
    CORS_ALLOWED_ORIGINS.extend(["http://localhost:5173", "http://127.0.0.1:5173"])
    CSRF_TRUSTED_ORIGINS.extend(["http://localhost:5173", "http://127.0.0.1:5173"])
else:
    CORS_ALLOWED_ORIGINS.extend([
        "http://147.45.224.189",
        "http://147.45.224.189:80",
        "https://147.45.224.189",
        "http://localhost",
        "http://localhost:80",
        "http://127.0.0.1",
        "http://frontend",  # Docker service name
    ])
    CSRF_TRUSTED_ORIGINS.extend([
        "http://147.45.224.189",
        "http://147.45.224.189:80", 
        "https://147.45.224.189",
        "http://localhost",
        "http://localhost:80",
        "http://127.0.0.1",
        "http://frontend",  # Docker service name
    ])

CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_ALL_ORIGINS = True  # Временно разрешаем все источники для отладки

# === Настройки безопасности ===
if not DEBUG:
    # Production security
    CSRF_COOKIE_SECURE = False
    SESSION_COOKIE_SECURE = False
    SECURE_HSTS_SECONDS = 0  # Отключаем HSTS для HTTP
    SECURE_HSTS_INCLUDE_SUBDOMAINS = False
    SECURE_HSTS_PRELOAD = False
    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
    SECURE_SSL_REDIRECT = False
    
    # Отключаем заголовки безопасности для HTTP
    SECURE_CONTENT_TYPE_NOSNIFF = False
    SECURE_BROWSER_XSS_FILTER = False
    SECURE_REFERRER_POLICY = None
    X_FRAME_OPTIONS = 'SAMEORIGIN'
else:
    # Development settings
    CSRF_COOKIE_SECURE = False
    SESSION_COOKIE_SECURE = False

# === Логирование ===
# Создаем директорию для логов если её нет
logs_dir = os.path.join(BASE_DIR, 'logs')
os.makedirs(logs_dir, exist_ok=True)

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'level': 'INFO',
            'class': 'logging.StreamHandler',
        },
        'file': {
            'level': 'ERROR',
            'class': 'logging.FileHandler',
            'filename': os.path.join(logs_dir, 'django_errors.log'),
        },
    },
    'loggers': {
        'django': {
            'handlers': ['console', 'file'],
            'level': 'INFO',
            'propagate': True,
        },
    },
}

if not DEBUG:
    # Дополнительные продакшен-логи
    LOGGING['handlers']['file']['level'] = 'WARNING'
    LOGGING['loggers']['django.request'] = {
        'handlers': ['console', 'file'],
        'level': 'ERROR',
        'propagate': False,
    }

# === Прочие настройки ===
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Настройки загрузки файлов
DATA_UPLOAD_MAX_MEMORY_SIZE = 50 * 1024 * 1024  # 50MB
FILE_UPLOAD_MAX_MEMORY_SIZE = 50 * 1024 * 1024  # 50MB
MAX_UPLOAD_SIZE = 50 * 1024 * 1024  # 50MB

# SMS и Telegram
EXOLVE_API_KEY = os.getenv("EXOLVE_API_KEY", "")
EXOLVE_SENDER_NAME = os.getenv("EXOLVE_SENDER_NAME", "RealtyBot")
EXOLVE_URL = os.getenv("EXOLVE_URL", "https://api.exolve.ru/v1/sms/send")
BOT_TOKEN = os.getenv('BOT_TOKEN', '')
WEBHOOK_URL = os.getenv('WEBHOOK_URL', '')
WEBHOOK_TOKEN = os.getenv('WEBHOOK_TOKEN', '')
# try:
#     response = httpx.post(
#         settings.WEBHOOK_URL,
#         json=serializer.data,
#         headers={'X-Token': settings.WEBHOOK_TOKEN},
#         timeout=5
#     )
#     response.raise_for_status()  # вызовет исключение для 4xx/5xx статусов
#     print(f"Вебхук отправлен успешно: {response.status_code}")
# except httpx.ConnectError as e:
#     print(f"Ошибка подключения: {e}")
# except httpx.TimeoutException:
#     print("Таймаут при отправке вебхука")
# except httpx.HTTPStatusError as e:
#     print(f"Ошибка HTTP: {e.response.status_code}")
# except Exception as e:
#     print(f"Неизвестная ошибка: {e}")
