import axios from 'axios';
import {API_URL} from "@/utils/config.js";

export const API_PUBLIC = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Добавьте интерсептор для логирования
API_PUBLIC.interceptors.request.use(config => {
    console.log(`Making request to: ${config.baseURL}${config.url}`);
    return config;
});