// Получение CSRF-токена из куки
export const getCSRFTokenFromCookie = () => {
  const csrf = document.cookie
    .split('; ')
    .find(row => row.startsWith('csrftoken='));
  return csrf ? csrf.split('=')[1] : '';
};
