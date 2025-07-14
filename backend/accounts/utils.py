import requests
from django.conf import settings

def send_sms_exolve(phone, message):
    """
    Отправка SMS через Exolve МТС API.
    """
    url = getattr(settings, 'EXOLVE_URL', 'https://api.exolve.ru/v1/sms/send')
    api_key = getattr(settings, 'EXOLVE_API_KEY', None)
    sender = getattr(settings, 'EXOLVE_SENDER_NAME', 'RealtyBot')
    if not api_key:
        raise Exception('EXOLVE_API_KEY не задан в настройках!')
    headers = {
        'Authorization': f'Bearer {api_key}',
        'Content-Type': 'application/json',
    }
    data = {
        'to': phone,
        'text': message,
        'from': sender,
    }
    response = requests.post(url, json=data, headers=headers, timeout=10)
    response.raise_for_status()
    return response.json() 