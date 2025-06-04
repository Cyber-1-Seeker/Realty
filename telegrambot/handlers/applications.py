from aiogram import Router, F
from aiogram.types import Message, InlineKeyboardButton, InlineKeyboardMarkup, CallbackQuery
from aiogram.filters import Command
from telegrambot.config import API_URL, API_TOKEN
from telegrambot.utils.formatting import format_application
import httpx
import json

router = Router()

# Создаем общие заголовки для всех запросов
API_HEADERS = {
    "Authorization": f"Token {API_TOKEN}"
}


# Функция для проверки прав пользователя
async def check_user_permissions(telegram_id):
    try:
        url = f"{API_URL}/api/accounts/check-permissions/?telegram_id={telegram_id}"
        async with httpx.AsyncClient() as client:
            res = await client.get(url, headers=API_HEADERS)

            if res.status_code != 200:
                print(f"Permission check failed: {res.status_code}")
                return False

            data = res.json()
            return data.get('has_permission', False)

    except Exception as e:
        print(f"Permission check error: {e}")
        return False


@router.message(Command("заявки"))
async def list_applications(message: Message, page: int = 1):
    # Проверяем права пользователя
    if not await check_user_permissions(str(message.from_user.id)):
        return await message.answer("❌ У вас недостаточно прав для просмотра заявок")

    try:
        # Формируем правильный URL
        url = f"{API_URL}/api/applications/applications/"
        async with httpx.AsyncClient() as client:
            res = await client.get(url, headers=API_HEADERS)

            # Проверяем статус ответа
            if res.status_code != 200:
                # Пытаемся получить JSON ошибки, если он есть
                try:
                    error_data = res.json()
                    error_msg = f"❌ Ошибка API ({res.status_code}): {error_data.get('detail', 'Неизвестная ошибка')}"
                except:
                    error_msg = f"❌ Ошибка API ({res.status_code}): {res.text[:100]}..."
                return await message.answer(error_msg)

            applications = res.json()

        # Проверяем, что applications - это список
        if not isinstance(applications, list):
            return await message.answer(f"⚠️ Неверный формат данных: {type(applications)}")

        if not applications:
            return await message.answer("Нет заявок.")

        # Пагинация: 5 заявок на страницу
        per_page = 5
        start = (page - 1) * per_page
        end = start + per_page
        current_apps = applications[start:end]
        total_pages = (len(applications) + per_page - 1) // per_page

        if not current_apps:
            return await message.answer(f"Нет заявок на странице {page}.")

        # Собираем текст и кнопки
        text_lines = [f"📋 <b>Заявки (стр. {page} из {total_pages}):</b>\n"]
        buttons = []

        status_map = {
            "new": "🟡 Новая",
            "in_progress": "🟠 В процессе",
            "done": "🟢 Завершена"
        }

        for app in current_apps:
            # Добавляем проверку наличия ключей
            status = status_map.get(app.get("status"), app.get("status", "Неизвестно"))
            app_id = app.get('id', 'N/A')
            name = app.get('name', 'Не указано')
            phone = app.get('phone', 'Не указан')

            text_lines.append(f"{app_id}. 👤 {name} | 📞 {phone} | {status}")
            buttons.append(
                InlineKeyboardButton(text=f"📝 #{app_id}", callback_data=f"view:{app_id}")
            )

        keyboard = [buttons[i:i + 2] for i in range(0, len(buttons), 2)]
        nav_buttons = []

        if page > 1:
            nav_buttons.append(InlineKeyboardButton(text="⬅️ Назад", callback_data=f"page:{page - 1}"))
        if end < len(applications):
            nav_buttons.append(InlineKeyboardButton(text="➡️ Далее", callback_data=f"page:{page + 1}"))
        if nav_buttons:
            keyboard.append(nav_buttons)

        markup = InlineKeyboardMarkup(inline_keyboard=keyboard)
        await message.answer("\n".join(text_lines), reply_markup=markup)

    except Exception as e:
        await message.answer(f"⚠️ Ошибка при получении заявок:\n{str(e)}")


@router.callback_query(F.data.startswith("view:"))
async def open_application(callback: CallbackQuery):
    # Проверяем права пользователя
    if not await check_user_permissions(str(callback.from_user.id)):
        await callback.answer("❌ У вас недостаточно прав", show_alert=True)
        return

    app_id = callback.data.split(":")[1]
    try:
        url = f"{API_URL}/api/applications/applications/{app_id}/"
        async with httpx.AsyncClient() as client:
            res = await client.get(url, headers=API_HEADERS)

            if res.status_code != 200:
                # Пытаемся получить JSON ошибки, если он есть
                try:
                    error_data = res.json()
                    error_msg = f"❌ Ошибка API ({res.status_code}): {error_data.get('detail', 'Неизвестная ошибка')}"
                except:
                    error_msg = f"❌ Ошибка API ({res.status_code}): {res.text[:100]}..."
                return await callback.answer(error_msg, show_alert=True)

            app = res.json()

        text = format_application(app)

        buttons = InlineKeyboardMarkup(inline_keyboard=[
            [
                InlineKeyboardButton(text="🔄 В процессе", callback_data=f"status:{app['id']}:in_progress"),
                InlineKeyboardButton(text="✅ Завершена", callback_data=f"status:{app['id']}:done"),
            ],
            [
                InlineKeyboardButton(text="❌ Удалить", callback_data=f"delete:{app['id']}")
            ],
            [
                InlineKeyboardButton(text="🔙 Назад к списку", callback_data=f"page:1")
            ]
        ])

        await callback.message.edit_text(text, reply_markup=buttons)
        await callback.answer()

    except Exception as e:
        await callback.answer(f"Ошибка: {str(e)}", show_alert=True)


@router.callback_query(F.data.startswith("page:"))
async def switch_page(callback: CallbackQuery):
    # Проверяем права пользователя
    if not await check_user_permissions(str(callback.from_user.id)):
        await callback.answer("❌ У вас недостаточно прав", show_alert=True)
        return

    page = int(callback.data.split(":")[1])

    try:
        # Формируем правильный URL
        url = f"{API_URL}/api/applications/applications/"
        async with httpx.AsyncClient() as client:
            res = await client.get(url, headers=API_HEADERS)

            # Проверяем статус ответа
            if res.status_code != 200:
                # Пытаемся получить JSON ошибки, если он есть
                try:
                    error_data = res.json()
                    error_msg = f"❌ Ошибка API ({res.status_code}): {error_data.get('detail', 'Неизвестная ошибка')}"
                except:
                    error_msg = f"❌ Ошибка API ({res.status_code}): {res.text[:100]}..."
                await callback.message.answer(error_msg)
                return await callback.answer()

            applications = res.json()

        # Проверяем, что applications - это список
        if not isinstance(applications, list):
            await callback.message.answer(f"⚠️ Неверный формат данных: {type(applications)}")
            return await callback.answer()

        if not applications:
            await callback.message.answer("Нет заявок.")
            return await callback.answer()

        # Пагинация: 5 заявок на страницу
        per_page = 5
        start = (page - 1) * per_page
        end = start + per_page
        current_apps = applications[start:end]
        total_pages = (len(applications) + per_page - 1) // per_page

        if not current_apps:
            await callback.message.answer(f"Нет заявок на странице {page}.")
            return await callback.answer()

        # Собираем текст и кнопки
        text_lines = [f"📋 <b>Заявки (стр. {page} из {total_pages}):</b>\n"]
        buttons = []

        status_map = {
            "new": "🟡 Новая",
            "in_progress": "🟠 В процессе",
            "done": "🟢 Завершена"
        }

        for app in current_apps:
            # Добавляем проверку наличия ключей
            status = status_map.get(app.get("status"), app.get("status", "Неизвестно"))
            app_id = app.get('id', 'N/A')
            name = app.get('name', 'Не указано')
            phone = app.get('phone', 'Не указан')

            text_lines.append(f"{app_id}. 👤 {name} | 📞 {phone} | {status}")
            buttons.append(
                InlineKeyboardButton(text=f"📝 #{app_id}", callback_data=f"view:{app_id}")
            )

        keyboard = [buttons[i:i + 2] for i in range(0, len(buttons), 2)]
        nav_buttons = []

        if page > 1:
            nav_buttons.append(InlineKeyboardButton(text="⬅️ Назад", callback_data=f"page:{page - 1}"))
        if end < len(applications):
            nav_buttons.append(InlineKeyboardButton(text="➡️ Далее", callback_data=f"page:{page + 1}"))
        if nav_buttons:
            keyboard.append(nav_buttons)

        markup = InlineKeyboardMarkup(inline_keyboard=keyboard)

        # Редактируем существующее сообщение вместо создания нового
        await callback.message.edit_text("\n".join(text_lines), reply_markup=markup)
        await callback.answer()

    except Exception as e:
        await callback.message.answer(f"⚠️ Ошибка при получении заявок:\n{str(e)}")
        await callback.answer()


@router.callback_query(F.data.startswith("status:"))
async def handle_status_change(callback: CallbackQuery):
    # Проверяем права пользователя
    if not await check_user_permissions(str(callback.from_user.id)):
        await callback.answer("❌ У вас недостаточно прав", show_alert=True)
        return

    _, app_id, new_status = callback.data.split(":")
    try:
        url = f"{API_URL}/api/applications/applications/{app_id}/"
        async with httpx.AsyncClient() as client:
            # Меняем статус
            res = await client.patch(
                url,
                json={"status": new_status},
                headers=API_HEADERS
            )

            if res.status_code != 200:
                # Пытаемся получить JSON ошибки, если он есть
                try:
                    error_data = res.json()
                    error_msg = f"❌ Ошибка API ({res.status_code}): {error_data.get('detail', 'Неизвестная ошибка')}"
                except:
                    error_msg = f"❌ Ошибка API ({res.status_code}): {res.text[:100]}..."
                return await callback.answer(error_msg, show_alert=True)

            # Получаем обновлённые данные
            res = await client.get(url, headers=API_HEADERS)
            app = res.json()

        text = format_application(app)
        await callback.message.edit_text(text, reply_markup=callback.message.reply_markup)
        await callback.answer("Статус обновлён ✅")

    except Exception as e:
        await callback.answer(f"Ошибка: {str(e)}", show_alert=True)


@router.callback_query(F.data.startswith("delete:"))
async def handle_delete(callback: CallbackQuery):
    # Проверяем права пользователя
    if not await check_user_permissions(str(callback.from_user.id)):
        await callback.answer("❌ У вас недостаточно прав", show_alert=True)
        return

    _, app_id = callback.data.split(":")
    try:
        url = f"{API_URL}/api/applications/applications/{app_id}/"
        async with httpx.AsyncClient() as client:
            res = await client.delete(url, headers=API_HEADERS)

            if res.status_code != 204:
                # Пытаемся получить JSON ошибки, если он есть
                try:
                    error_data = res.json()
                    error_msg = f"❌ Ошибка API ({res.status_code}): {error_data.get('detail', 'Неизвестная ошибка')}"
                except:
                    error_msg = f"❌ Ошибка API ({res.status_code}): {res.text[:100]}..."
                return await callback.answer(error_msg, show_alert=True)

        await callback.message.edit_text("❌ Заявка удалена")
        await callback.answer()

    except Exception as e:
        await callback.answer(f"Ошибка при удалении: {str(e)}", show_alert=True)


async def get_users_to_notify(api_url, api_token):
    print("Работает")
    """Получаем список пользователей для уведомлений"""
    try:
        url = f"{api_url}/api/applications/notify-users/"
        headers = {"Authorization": f"Token {api_token}"}

        async with httpx.AsyncClient() as client:
            response = await client.get(url, headers=headers)

            if response.status_code == 200:
                return response.json()
            else:
                print(f"Ошибка при получении пользователей: {response.status_code}")
                return []

    except Exception as e:
        print(f"Ошибка в get_users_to_notify: {e}")
        return []
