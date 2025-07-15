import re
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
    # Приводим номер к формату 79XXXXXXXXX
    phone_digits = re.sub(r'\D', '', phone)
    if phone_digits.startswith('8'):
        phone_digits = '7' + phone_digits[1:]
    if phone_digits.startswith('7') and len(phone_digits) == 11:
        pass
    elif phone_digits.startswith('9') and len(phone_digits) == 10:
        phone_digits = '7' + phone_digits
    else:
        raise ValueError('Номер телефона должен быть в формате 79XXXXXXXXX')
    data = {
        'number': sender,
        'destination': phone_digits,
        'text': message,
    }
    response = requests.post(url, json=data, headers=headers, timeout=10)
    try:
        response.raise_for_status()
    except requests.HTTPError:
        print("Exolve response:", response.text)
        raise
    return response.json() 