import requests
from django.conf import settings

def send_sms_exolve(phone, message):
    url = getattr(settings, 'EXOLVE_URL', 'https://api.exolve.ru/messaging/v1/SendSMS')
    api_key = getattr(settings, 'EXOLVE_API_KEY', None)
    sender = getattr(settings, 'EXOLVE_SENDER_NAME', 'RealtyBot')
    if not api_key:
        raise Exception('EXOLVE_API_KEY не задан в настройках!')
    headers = {
        'Authorization': f'Bearer {api_key}',
        'Content-Type': 'application/json',
    }
    data = {
        'number': sender,         # имя отправителя (альфа-имя)
        'destination': phone,     # номер получателя (без +)
        'text': message,
    }
    response = requests.post(url, json=data, headers=headers, timeout=10)
    try:
        response.raise_for_status()
    except requests.HTTPError:
        print("Exolve response:", response.text)
        raise
    return response.json() 