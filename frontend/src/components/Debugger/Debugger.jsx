// src/components/Debugger/Debugger.jsx
import { useEffect } from 'react';
import { API_PUBLIC, API_AUTH } from "@/utils/api/axiosPublic";
import { API_URL } from "@/utils/config.js";

const Debugger = () => {
  useEffect(() => {
    console.groupCollapsed("[DEBUG] API Configuration");
    console.log("API_URL:", API_URL);
    console.log("API_PUBLIC baseURL:", API_PUBLIC.defaults.baseURL);
    console.log("API_AUTH baseURL:", API_AUTH?.defaults?.baseURL);
    console.groupEnd();

    // Проверка формирования путей
    const testUrls = [
      '/api/accounts/csrf/',
      'api/accounts/csrf/',
      '/test',
      'test'
    ];

    console.groupCollapsed("[DEBUG] URL Formation Test");
    testUrls.forEach(url => {
      console.log(`Requesting ${url} → Full URL: ${API_PUBLIC.defaults.baseURL}${url}`);
    });
    console.groupEnd();

    // Проверка реальных запросов
    const testRequests = async () => {
      try {
        console.groupCollapsed("[DEBUG] Actual API Requests");

        // CSRF запрос
        console.log("Testing /api/accounts/csrf/");
        const csrfResponse = await API_PUBLIC.get('/api/accounts/csrf/');
        console.log("CSRF Response:", csrfResponse);

        // Запрос данных пользователя
        console.log("Testing /api/accounts/me/");
        const meResponse = await API_PUBLIC.get('/api/accounts/me/');
        console.log("User Data Response:", meResponse);

        console.groupEnd();
      } catch (error) {
        console.error("API Request Error:", error);
        console.groupEnd();
      }
    };

    testRequests();
  }, []);

  return null; // Этот компонент ничего не рендерит
};

export default Debugger;