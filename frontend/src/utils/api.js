import { getCSRFTokenFromCookie } from './api/csrf.js';
import { API_URL } from './config';

export const secureFetch = async (endpoint, options = {}) => {
  const csrfToken = getCSRFTokenFromCookie();

  return fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'X-CSRFToken': csrfToken,
      ...(options.headers || {}),
    },
    credentials: 'include',
  });
};
