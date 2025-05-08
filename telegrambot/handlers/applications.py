from aiogram import Router, F
from aiogram.types import Message, InlineKeyboardButton, InlineKeyboardMarkup, CallbackQuery
from aiogram.filters import Command
from telegrambot.config import API_URL, ADMIN_CHAT_ID
from telegrambot.utils.formatting import format_application
import httpx

router = Router()


# 📬 Команда /заявки — выводит список последних заявок с кнопками и пагинацией
@router.message(Command("заявки"))
async def list_applications(message: Message, page: int = 1):
    if message.chat.id != ADMIN_CHAT_ID:
        return await message.answer("❌ У вас нет доступа")

    try:
        async with httpx.AsyncClient() as client:
            res = await client.get(f"{API_URL}/applications/applications/")
            data = res.json()

        if not data:
            return await message.answer("Нет заявок.")

        # Пагинация: 5 заявок на страницу
        per_page = 5
        start = (page - 1) * per_page
        end = start + per_page
        current_apps = data[start:end]

        if not current_apps:
            return await message.answer("Нет заявок на этой странице.")

        # Собираем текст и кнопки
        text_lines = [f"📋 <b>Заявки (стр. {page}):</b>\n"]
        buttons = []

        status_map = {
            "new": "🟡 Новая",
            "in_progress": "🟠 В процессе",
            "done": "🟢 Завершена"
        }

        for app in current_apps:
            status = status_map.get(app["status"], app["status"])
            text_lines.append(f"{app['id']}. 👤 {app['name']} | 📞 {app['phone']} | {status}")
            buttons.append(
                InlineKeyboardButton(text=f"📝 Заявка #{app['id']}", callback_data=f"view:{app['id']}")
            )

        keyboard = [buttons[i:i + 2] for i in range(0, len(buttons), 2)]
        nav_buttons = []

        if start > 0:
            nav_buttons.append(InlineKeyboardButton(text="⬅️ Назад", callback_data=f"page:{page - 1}"))
        if end < len(data):
            nav_buttons.append(InlineKeyboardButton(text="➡️ Далее", callback_data=f"page:{page + 1}"))
        if nav_buttons:
            keyboard.append(nav_buttons)

        markup = InlineKeyboardMarkup(inline_keyboard=keyboard)
        await message.answer("\n".join(text_lines), reply_markup=markup)

    except Exception as e:
        await message.answer(f"⚠️ Ошибка при получении заявок:\n{e}")


# 📝 Команда view:<id> — открывает подробную информацию по заявке
@router.callback_query(F.data.startswith("view:"))
async def open_application(callback: CallbackQuery):
    app_id = callback.data.split(":")[1]
    try:
        async with httpx.AsyncClient() as client:
            res = await client.get(f"{API_URL}/applications/applications/{app_id}/")
            app = res.json()

        text = format_application(app)

        buttons = InlineKeyboardMarkup(inline_keyboard=[
            [
                InlineKeyboardButton(text="🔄 В процессе", callback_data=f"status:{app['id']}:in_progress"),
                InlineKeyboardButton(text="✅ Завершена", callback_data=f"status:{app['id']}:done"),
            ],
            [
                InlineKeyboardButton(text="❌ Удалить", callback_data=f"delete:{app['id']}")
            ]
        ])

        await callback.message.answer(text, reply_markup=buttons)
        await callback.answer()

    except Exception as e:
        await callback.answer(f"Ошибка: {e}", show_alert=True)


# 🔄 Перелистывание страниц списка
@router.callback_query(F.data.startswith("page:"))
async def switch_page(callback: CallbackQuery):
    page = int(callback.data.split(":")[1])
    await callback.message.delete()  # удалим старый список
    await list_applications(callback.message, page=page)
    await callback.answer()


# ✅ Изменение статуса заявки
@router.callback_query(F.data.startswith("status:"))
async def handle_status_change(callback: CallbackQuery):
    _, app_id, new_status = callback.data.split(":")
    try:
        async with httpx.AsyncClient() as client:
            # Меняем статус
            await client.patch(f"{API_URL}/applications/applications/{app_id}/", json={"status": new_status})
            # Получаем обновлённые данные
            res = await client.get(f"{API_URL}/applications/applications/{app_id}/")
            app = res.json()

        text = format_application(app)
        await callback.message.edit_text(text, reply_markup=None)
        await callback.answer("Статус обновлён ✅")

    except Exception as e:
        await callback.answer(f"Ошибка: {e}", show_alert=True)


# ❌ Удаление заявки
@router.callback_query(F.data.startswith("delete:"))
async def handle_delete(callback: CallbackQuery):
    _, app_id = callback.data.split(":")
    try:
        async with httpx.AsyncClient() as client:
            await client.delete(f"{API_URL}/applications/applications/{app_id}/")

        await callback.message.edit_text("❌ Заявка удалена")
        await callback.answer()

    except Exception as e:
        await callback.answer(f"Ошибка при удалении: {e}", show_alert=True)
