import asyncio
from aiogram import Bot, Dispatcher
from aiogram.enums import ParseMode
from aiogram.client.default import DefaultBotProperties
from config import BOT_TOKEN, ADMIN_CHAT_ID, WEBHOOK_TOKEN
from telegrambot.handlers import applications
from telegrambot.utils.formatting import format_application  # Импортируем форматирование
import aiohttp.web


async def handle_new_application(request):
    # Проверяем токен из заголовка
    token = request.headers.get('X-Token')
    if token != WEBHOOK_TOKEN:
        return aiohttp.web.Response(text="Unauthorized", status=401)

    try:
        data = await request.json()
        bot = request.app['bot']

        # Форматируем сообщение о заявке
        message = "🚀 *Новая заявка!*\n" + format_application(data)

        # Отправляем сообщение в админский чат
        await bot.send_message(
            chat_id=ADMIN_CHAT_ID,
            text=message,
            parse_mode=ParseMode.MARKDOWN
        )
        return aiohttp.web.Response(text="Уведомление отправлено", status=200)
    except Exception as e:
        return aiohttp.web.Response(text=f"Error: {e}", status=500)


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
    app.router.add_post('/new_application', handle_new_application)

    runner = aiohttp.web.AppRunner(app)
    await runner.setup()
    site = aiohttp.web.TCPSite(runner, '0.0.0.0', 8080)
    await site.start()

    # Уведомление о запуске
    await bot.send_message(ADMIN_CHAT_ID, "✅ Бот запущен и готов к работе")

    # Запуск поллинга и сервера
    try:
        await dp.start_polling(bot)
    finally:
        await runner.cleanup()


if __name__ == "__main__":
    asyncio.run(main())
