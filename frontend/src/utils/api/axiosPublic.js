import axios from 'axios';

// Используем напрямую из import.meta.env
const API_URL = import.meta.env.VITE_API_BASE_URL;

export const API_PUBLIC = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Логирование для отладки
if (import.meta.env.MODE === 'development') {
  console.log(`[API_PUBLIC] Base URL: ${API_URL}`);
}