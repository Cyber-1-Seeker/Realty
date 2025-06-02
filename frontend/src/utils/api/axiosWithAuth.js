import axios from 'axios';
import {getCSRFTokenFromCookie} from './csrf';

// Авторизованный axios с CSRF и токеном
export const API_AUTH = axios.create({
    baseURL: 'http://localhost:8000',
    withCredentials: true,
});

API_AUTH.interceptors.request.use((config) => {
    const csrfToken = getCSRFTokenFromCookie();
    const authToken = localStorage.getItem('authToken');  // Добавлено

    if (csrfToken) {
        config.headers['X-CSRFToken'] = csrfToken;
    }

    if (authToken) {
        config.headers['Authorization'] = `Token ${authToken}`;  // Добавлено
    }

    return config;
});