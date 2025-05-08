import asyncio
from aiogram import Bot, Dispatcher
from aiogram.enums import ParseMode
from aiogram.client.default import DefaultBotProperties
from config import BOT_TOKEN, ADMIN_CHAT_ID
from telegrambot.handlers import applications


async def main():
    bot = Bot(
        token=BOT_TOKEN,
        default=DefaultBotProperties(parse_mode=ParseMode.HTML)
    )
    dp = Dispatcher()
    dp.include_router(applications.router)

    # Подключаем все хендлеры
    # register_application_handlers(dp)

    # Приветствие администратору
    await bot.send_message(ADMIN_CHAT_ID, "✅ Бот запущен и готов к работе")

    # Стартуем бота (long polling)
    await dp.start_polling(bot)


if __name__ == "__main__":
    asyncio.run(main())
