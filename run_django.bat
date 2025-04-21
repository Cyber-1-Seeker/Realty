@echo off
echo ▶ Активация виртуального окружения...
call "venv\Scripts\activate.bat"
cd backend
echo ▶ Запуск Django-сервера...
python manage.py runserver
pause
