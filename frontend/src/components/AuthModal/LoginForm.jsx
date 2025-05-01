import React, {useEffect, useState} from 'react';
import styles from './LoginRegisterForm.module.css';
import {secureFetch} from '@/utils/api';

const LoginForm = () => {
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');

    // Получаем CSRF токен
    useEffect(() => {
        fetch('/api/accounts/csrf/', {credentials: 'include'});
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await secureFetch('/api/accounts/login/', {
                method: 'POST',
                body: JSON.stringify({phone_number: phone})
            });

            const data = await response.json();

            if (response.ok) {
                window.location.reload();
            } else {
                setError(data.error || 'Ошибка входа');
            }
        } catch (error) {
            setError('Сервер недоступен');
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <label>
                Номер телефона:
                <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                />
            </label>
            {error && <div className={styles.error}>{error}</div>}
            <button type="submit">Войти</button>
        </form>
    );
};

export default LoginForm;
