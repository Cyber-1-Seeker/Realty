
import { useCallback } from 'react';

/**
 * Универсальный хук для защиты действий, доступных только авторизованным пользователям.
 *
 * @param {boolean} isAuthenticated - Статус авторизации пользователя.
 * @param {function} onFail - Функция, вызываемая при отсутствии авторизации (например, открыть модалку).
 * @returns {(fn: function) => function} - Обёртка для защищённых действий.
 */
const useAuthGuard = (isAuthenticated, onFail) => {
  return useCallback(
    (fn) => {
      return (...args) => {
        if (!isAuthenticated) {
          onFail?.();
          return;
        }
        fn(...args);
      };
    },
    [isAuthenticated, onFail]
  );
};

export default useAuthGuard;
