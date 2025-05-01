import { getCSRFTokenFromCookie } from './csrf';

export const secureFetch = async (url, options = {}) => {
  const csrfToken = getCSRFTokenFromCookie();

  return fetch(url, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrfToken,
      ...(options.headers || {}),
    },
    ...options,
  });
};
