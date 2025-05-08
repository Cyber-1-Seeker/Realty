import React, {useEffect, useState} from 'react';
import styles from './LoginRegisterForm.module.css';
import {API_AUTH} from "@/utils/api/axiosWithAuth.js";

const LoginForm = ({switchToRegister}) => {
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        API_AUTH.get('/api/accounts/csrf/');
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await API_AUTH.post('/api/accounts/login/', {
                phone_number: phone
            });

            if (response.status === 200) {
                window.location.reload();
            } else {
                setError(response.data?.error || 'Ошибка входа');
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
