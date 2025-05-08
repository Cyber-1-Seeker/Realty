import axios from 'axios';

// Публичные запросы без авторизации и CSRF
export const API_PUBLIC = axios.create({
    baseURL: 'http://localhost:8000',
});
