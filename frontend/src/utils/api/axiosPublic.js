import axios from 'axios';
import { API_URL } from "@/utils/config.js";

export const API_PUBLIC = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    }
});