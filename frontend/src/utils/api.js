import { getCSRFTokenFromCookie } from './csrf';
import { API_URL } from './config';

export const secureFetch = async (endpoint, options = {}) => {
  const csrfToken = getCSRFTokenFromCookie();

  return fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrfToken,
      ...(options.headers || {}),
    },
    credentials: 'include',
  });
};
