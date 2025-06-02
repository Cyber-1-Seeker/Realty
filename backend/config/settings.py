"""
Django settings for config project.
"""

from pathlib import Path
from dotenv import load_dotenv
import os

# === Базовая настройка ===

BASE_DIR = Path(__file__).resolve().parent.parent.parent
load_dotenv(os.path.join(BASE_DIR, '.env'))

SECRET_KEY = os.getenv("SECRET_KEY", "insecure-secret")
DEBUG = os.getenv("DEBUG", "False") == "True"

ALLOWED_HOSTS = os.getenv("ALLOWED_HOSTS", "").split(",") if os.getenv("ALLOWED_HOSTS") else []

# === Приложения ===

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

# === Middleware ===

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

# === URLs и шаблоны ===

ROOT_URLCONF = 'config.urls'

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

WSGI_APPLICATION = 'config.wsgi.application'

# === База данных ===

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.postgresql',
#         'NAME': 'PostgreSQL 17',
#         'USER': 'postgres',
#         'PASSWORD': 'Sh1nda_SenSh1',
#         'HOST': 'localhost',
#         'PORT': '5432',
#     }
# }


# === Пароли ===

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# === Интернационализация ===

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'Europe/Moscow'
USE_I18N = True
USE_TZ = True

# === Файлы ===

STATIC_URL = 'static/'
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# === Пользовательская модель ===

AUTH_USER_MODEL = 'accounts.CustomUser'

# === DRF ===

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework.authentication.TokenAuthentication',  # Добавляем токен-аутентификацию для тг бота
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',  # Требуем аутентификацию по умолчанию
    ]
}

CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
        "LOCATION": "rate-limit-cache",
    }
}

# === CORS и CSRF ===




CORS_ALLOWED_ORIGINS = ["http://localhost:5173"]
CSRF_TRUSTED_ORIGINS = ["http://localhost:5173"]
CORS_ALLOW_CREDENTIALS = True

# === Cookie-настройки ===

CSRF_COOKIE_NAME = "csrftoken"
SESSION_COOKIE_NAME = "sessionid"

CSRF_COOKIE_HTTPONLY = False
SESSION_COOKIE_HTTPONLY = True

CSRF_COOKIE_SAMESITE = "Lax"
SESSION_COOKIE_SAMESITE = "Lax"

# WEBHOOK
WEBHOOK_TOKEN = os.getenv('WEBHOOK_TOKEN')
WEBHOOK_URL = os.getenv('WEBHOOK_URL', 'http://localhost:8081/new_application')

# TELEGRAM BOT
BOT_TOKEN = os.getenv('BOT_TOKEN')

# === Безопасность по окружению ===

# Только если DEBUG = False:
if not DEBUG:
    CSRF_COOKIE_SECURE = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SAMESITE = "None"
    SESSION_COOKIE_SAMESITE = "None"
else:
    CSRF_COOKIE_SAMESITE = "Lax"
    SESSION_COOKIE_SAMESITE = "Lax"

# === Ключ по умолчанию для моделей ===

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# === Сервис для подтверждения номера телефона ===
EXOLVE_API_KEY = "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJRV05sMENiTXY1SHZSV29CVUpkWjVNQURXSFVDS0NWODRlNGMzbEQtVHA0In0.eyJleHAiOjIwNjM4Mjk4MDIsImlhdCI6MTc0ODQ2OTgwMiwianRpIjoiZjIxOTkxNzQtOTQyNS00ZmJkLWI4ZWEtMjIzZGM1YTE2MDgyIiwiaXNzIjoiaHR0cHM6Ly9zc28uZXhvbHZlLnJ1L3JlYWxtcy9FeG9sdmUiLCJhdWQiOiJhY2NvdW50Iiwic3ViIjoiZTYyZGY2Y2ItM2Y5My00N2VhLTkzZGUtYjdlYzRlYmQyYmUxIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoiOWI1YWU0YTEtZjQxYS00YjU2LWFmNjAtNTg5MDMyNWFkNGVjIiwic2Vzc2lvbl9zdGF0ZSI6ImQ4NzE5M2ExLTM0MDAtNGVkMS1iZjdiLTcyMGFhZjE2ZWJjNCIsImFjciI6IjEiLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsiZGVmYXVsdC1yb2xlcy1leG9sdmUiLCJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJleG9sdmVfYXBwIHByb2ZpbGUgZW1haWwiLCJzaWQiOiJkODcxOTNhMS0zNDAwLTRlZDEtYmY3Yi03MjBhYWYxNmViYzQiLCJ1c2VyX3V1aWQiOiJjN2ZlODM0Yi0yYTM0LTQ2ODktYThmNC1lYzU0ZjI4Y2U3YmYiLCJjbGllbnRIb3N0IjoiMTcyLjE2LjE2MS4xOSIsImNsaWVudElkIjoiOWI1YWU0YTEtZjQxYS00YjU2LWFmNjAtNTg5MDMyNWFkNGVjIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJhcGlfa2V5Ijp0cnVlLCJhcGlmb25pY2Ffc2lkIjoiOWI1YWU0YTEtZjQxYS00YjU2LWFmNjAtNTg5MDMyNWFkNGVjIiwiYmlsbGluZ19udW1iZXIiOiIxMzI3ODM2IiwiYXBpZm9uaWNhX3Rva2VuIjoiYXV0ZGZlM2EyMWMtY2I0OS00NjgxLWI2NWEtNjgyNTU0MWFmNDg4IiwicHJlZmVycmVkX3VzZXJuYW1lIjoic2VydmljZS1hY2NvdW50LTliNWFlNGExLWY0MWEtNGI1Ni1hZjYwLTU4OTAzMjVhZDRlYyIsImN1c3RvbWVyX2lkIjoiMTMxMzcxIiwiY2xpZW50QWRkcmVzcyI6IjE3Mi4xNi4xNjEuMTkifQ.IGaDi6nK5tSXT0IxFDgh0T0kGp3jDOhiQ_1sQXYqxk48qPCLTK8iML9zWpmTScaa72gWEcV9sfKMfdGadMt2_CTqgmE49SNH5dpNK9eyat9e_4QGVE4Y-KhastqmNg8rZDLvhpMUHLR_OglVCVxvLoujcCTOT2GaWm06f_tvEJgsj31tx3HlfEfdsXf3T5fnfaq36z1AIkaJU_WO1wdGkBZ-KOXQeIaJ7cQYrKCbwuiMaFSTu7QiyaDKwvNURH6DvkcGCFl0lWoH9kG3v5eeR2xcRpaDc54JFg2CoTjI0YN136AO1CePbLK8OXiAVN7hUoS8vZp6X8Slr8JOvARyWQ"
EXOLVE_SENDER_NAME = "ВашSender"  # Имя отправителя, зарегистрированное в Exolve
SMS_RATE_LIMIT = 10  # Максимум SMS в час
