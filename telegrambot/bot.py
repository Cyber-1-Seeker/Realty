# import asyncio
# from aiogram import Bot, Dispatcher
# from aiogram.enums import ParseMode
# from aiogram.client.default import DefaultBotProperties
# from config import BOT_TOKEN, WEBHOOK_TOKEN, API_TOKEN, API_URL
# from telegrambot.handlers import applications
# import aiohttp.web
#
#
# async def handle_new_application(request):
#     # Проверяем токен из заголовка
#     token = request.headers.get('X-Token')
#     if token != WEBHOOK_TOKEN:
#         return aiohttp.web.Response(text="Unauthorized", status=401)
#
#     try:
#         data = await request.json()
#         bot = request.app['bot']
#         # Получаем список пользователей для уведомлений
#         users_to_notify = await applications.get_users_to_notify(API_URL, API_TOKEN)
#
#         if not users_to_notify:
#             print("Нет пользователей для уведомления")
#             return aiohttp.web.Response(text="Нет пользователей для уведомления", status=200)
#
#         # Форматируем сообщение о заявке
#         message = "🚀 *Новая заявка!*\n" + applications.format_application(data)
#
#         # Отправляем сообщение всем пользователям
#         success_count = 0
#         for user in users_to_notify:
#             try:
#                 await bot.send_message(
#                     chat_id=user['telegram_id'],
#                     text=message,
#                     parse_mode=ParseMode.HTML
#                 )
#                 success_count += 1
#             except Exception as e:
#                 print(f"Ошибка отправки пользователю {user['id']}: {e}")
#
#         return aiohttp.web.Response(
#             text=f"Уведомления отправлены {success_count}/{len(users_to_notify)} пользователям",
#             status=200
#         )
#     except Exception as e:
#         return aiohttp.web.Response(text=f"Error: {str(e)}", status=500)
#
#
# async def main():
#     bot = Bot(
#         token=BOT_TOKEN,
#         default=DefaultBotProperties(parse_mode=ParseMode.HTML)
#     )
#     dp = Dispatcher()
#     dp.include_router(applications.router)
#
#     # Настройка веб-сервера для вебхуков
#     app = aiohttp.web.Application()
#     app['bot'] = bot
#     app.router.add_post('/new_application', handle_new_application)
#
#     runner = aiohttp.web.AppRunner(app)
#     await runner.setup()
#     site = aiohttp.web.TCPSite(runner, '0.0.0.0', 8081)
#     await site.start()
#
#     # Запуск поллинга и сервера
#     try:
#         await dp.start_polling(bot)
#     finally:
#         await runner.cleanup()
#
# if __name__ == "__main__":
#     asyncio.run(main())





import asyncio
from aiogram import Bot, Dispatcher
from aiogram.enums import ParseMode
from aiogram.client.default import DefaultBotProperties
from config import BOT_TOKEN, WEBHOOK_TOKEN, API_TOKEN, API_URL
from telegrambot.handlers import applications
import aiohttp.web


# Добавляем healthcheck эндпоинт
async def handle_health_check(request):
    return aiohttp.web.Response(text="OK", status=200)


async def handle_new_application(request):
    # Проверяем токен из заголовка
    token = request.headers.get('X-Token')
    if token != WEBHOOK_TOKEN:
        return aiohttp.web.Response(text="Unauthorized", status=401)

    try:
        data = await request.json()
        bot = request.app['bot']
        # Получаем список пользователей для уведомлений
        users_to_notify = await applications.get_users_to_notify(API_URL, API_TOKEN)

        if not users_to_notify:
            print("Нет пользователей для уведомления")
            return aiohttp.web.Response(text="Нет пользователей для уведомления", status=200)

        # Форматируем сообщение о заявке
        message = "🚀 *Новая заявка!*\n" + applications.format_application(data)

        # Отправляем сообщение всем пользователям
        success_count = 0
        for user in users_to_notify:
            try:
                await bot.send_message(
                    chat_id=user['telegram_id'],
                    text=message,
                    parse_mode=ParseMode.HTML
                )
                success_count += 1
            except Exception as e:
                print(f"Ошибка отправки пользователю {user['id']}: {e}")

        return aiohttp.web.Response(
            text=f"Уведомления отправлены {success_count}/{len(users_to_notify)} пользователям",
            status=200
        )
    except Exception as e:
        return aiohttp.web.Response(text=f"Error: {str(e)}", status=500)


async def main():
    bot = Bot(
        token=BOT_TOKEN,
        default=DefaultBotProperties(parse_mode=ParseMode.HTML)
    )
    dp = Dispatcher()
    dp.include_router(applications.router)

    # Настройка веб-сервера для вебхуков
    app = aiohttp.web.Application()
    app['bot'] = bot

    # Регистрируем эндпоинты
    app.router.add_get('/health', handle_health_check)  # Добавлен healthcheck
    app.router.add_post('/new_application', handle_new_application)

    runner = aiohttp.web.AppRunner(app)
    await runner.setup()
    site = aiohttp.web.TCPSite(runner, '0.0.0.0', 8081)
    await site.start()

    print(f"Сервер запущен на http://0.0.0.0:8081")
    print(f"Healthcheck доступен по /health")
    print(f"Вебхук для новых заявок: /new_application")

    # Запуск поллинга и сервера
    try:
        await dp.start_polling(bot)
    finally:
        await runner.cleanup()


if __name__ == "__main__":
    asyncio.run(main())
