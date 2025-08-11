import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import styles from './LoginRegisterForm.module.css';
import {API_AUTH} from "@/utils/api/axiosWithAuth.js";

const LoginForm = ({ onSuccess }) => {
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');

    // Загружаем CSRF при монтировании
    useEffect(() => {
        API_AUTH.get('/api/accounts/csrf/');
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await API_AUTH.post('/api/accounts/login/', {
                phone_number: phone,
            });

            if (response.status === 200) {
                onSuccess?.(); // Вызываем колбэк успешной авторизации
            }
        } catch (err) {
            const data = err?.response?.data;
            const message =
                data?.phone_number?.[0] ||
                data?.non_field_errors?.[0] ||
                data?.detail ||
                'Номер не найден';

            setError(message);
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
            
            <div className={styles.privacyNote}>
                Нажимая на кнопку, вы соглашаетесь с <Link to="/privacy">политикой конфиденциальности</Link>
            </div>
        </form>
    );
};

export default LoginForm;
