// Используем глобальное окружение Vite
export const API_URL = import.meta.env.VITE_API_BASE_URL;
export const DEBUG_MODE = import.meta.env.MODE === 'development';
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

// Логируем только в development
if (import.meta.env.MODE === 'development') {
    console.log(`Текущий режим: ${DEBUG_MODE ? 'Разработка' : 'Продакшен'}`);
    console.log(`API базовый URL: ${API_URL}`);
}