import axios from 'axios';
import {getCSRFTokenFromCookie} from './csrf';

// Авторизованный axios с CSRF и withCredentials
export const API_AUTH = axios.create({
    baseURL: 'http://localhost:8000',
    withCredentials: true,
});

API_AUTH.interceptors.request.use((config) => {
    const csrfToken = getCSRFTokenFromCookie();
    if (csrfToken) {
        config.headers['X-CSRFToken'] = csrfToken;
    }
    return config;
});
