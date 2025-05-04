import React, { useState, useEffect } from 'react';
import styles from './LoginRegisterForm.module.css';
import { secureFetch } from '@/utils/api';

const RegisterForm = ({ switchToLogin }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/accounts/csrf/', { credentials: 'include' });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await secureFetch('/api/accounts/register/', {
        method: 'POST',
        body: JSON.stringify({
          first_name: name,
          phone_number: phone,
          email: email,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        window.location.reload();
      } else {
        setError(data.phone_number?.[0] || data.email?.[0] || 'Ошибка регистрации');
      }
    } catch {
      setError('Сервер недоступен');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.authForm}>
      <h2 className={styles.title}>Регистрация</h2>

      <label className={styles.label}>
        Имя:
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className={styles.input}
        />
      </label>

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

      <label className={styles.label}>
        Email:
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={styles.input}
        />
      </label>

      {error && <div className={styles.error}>{error}</div>}

      <button type="submit" className={styles.button}>
        Создать аккаунт
      </button>
    </form>
  );
};

export default RegisterForm;
