import React, { useEffect, useState } from 'react';
import styles from './LoginRegisterForm.module.css';
import { secureFetch } from '@/utils/api';

const LoginForm = ({ switchToRegister }) => {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/accounts/csrf/', { credentials: 'include' });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await secureFetch('/api/accounts/login/', {
        method: 'POST',
        body: JSON.stringify({ phone_number: phone })
      });

      const data = await response.json();
      if (response.ok) {
        window.location.reload();
      } else {
        setError(data.error || 'Ошибка входа');
      }
    } catch {
      setError('Сервер недоступен');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.authForm}>
      <h2 className={styles.title}>Вход</h2>

      <label className={styles.label}>
        Номер телефона:
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          className={styles.input}
        />
      </label>

      {error && <div className={styles.error}>{error}</div>}

      <button type="submit" className={styles.button}>
        Войти
      </button>
    </form>
  );
};

export default LoginForm;
