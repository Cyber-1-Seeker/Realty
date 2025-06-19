export const  ReAPI_URL = import.meta.env.VITE_API_BASE_URL;
export const DEBUG_MODE = import.meta.env.DEV; // true в разработке, false в production
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

console.log(`Текущий режим: ${DEBUG_MODE ? 'Разработка' : 'Продакшен'}`);
