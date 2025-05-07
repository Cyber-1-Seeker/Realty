import axios from 'axios';
import { getCSRFTokenFromCookie } from '@/utils/csrf';
import { API_URL } from '@/utils/config';

const API_AUTH = axios.create({
  baseURL: `${API_URL}/api/`,
  withCredentials: true, // обязательно для сессионной авторизации
});

API_AUTH.interceptors.request.use((config) => {
  const token = getCSRFTokenFromCookie();
  if (token) {
    config.headers['X-CSRFToken'] = token;
  }
  return config;
});

export { API_AUTH };
