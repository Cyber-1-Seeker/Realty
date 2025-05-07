import axios from 'axios';
// axios для запросов от незарегистрированных пользователей
export const API_PUBLIC = axios.create({
  baseURL: 'http://localhost:8000/api/',
});
