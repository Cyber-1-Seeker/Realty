def format_application(app):
    status_map = {
        "new": "🟡 Новая",
        "in_progress": "🟠 В процессе",
        "done": "🟢 Завершена"
    }

    # Добавляем обработку возможного отсутствия данных
    name = app.get('name', 'Не указано')
    phone = app.get('phone', 'Не указан')
    created_at = app.get('created_at', '')[:19].replace('T', ' ') if app.get('created_at') else 'Не указана'
    comment = app.get('comment', 'Без комментария')
    status = status_map.get(app.get('status', ''), app.get('status', 'Неизвестен'))

    return (
        f"<b>Заявка #{app.get('id', 'N/A')}</b>\n"
        f"👤 <b>{name}</b>\n"
        f"📞 {phone}\n"
        f"🗓 {created_at}\n"
        f"💬 {comment}\n"
        f"📌 Статус: <b>{status}</b>"
    )
