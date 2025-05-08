def format_application(app):
    status_map = {
        "new": "🟡 Новая",
        "in_progress": "🟠 В процессе",
        "done": "🟢 Завершена"
    }

    return (
        f"<b>Заявка #{app['id']}</b>\n"
        f"👤 <b>{app['name']}</b>\n"
        f"📞 {app['phone']}\n"
        f"🗓 {app['created_at'][:19].replace('T', ' ')}\n"
        f"💬 {app['comment']}\n"
        f"📌 Статус: <b>{status_map.get(app['status'], app['status'])}</b>"
    )
