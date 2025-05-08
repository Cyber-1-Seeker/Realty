import React, {useState, useEffect} from 'react';
import styles from './LoginRegisterForm.module.css';
import {API_PUBLIC} from "@/utils/api/axiosPublic.js";
import ConfirmPhoneForm from './ConfirmPhoneForm';

const RegisterForm = ({switchToLogin}) => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [token, setToken] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        API_PUBLIC.get('/api/accounts/csrf/');
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await API_PUBLIC.post('/api/accounts/register/', {
                first_name: name,
                phone,
                email
            });

            if (response.status === 200) {
                setToken(response.data.token);
            } else {
                setError(response.data.phone?.[0] || response.data.email?.[0] || 'Ошибка регистрации');
            }
        } catch {
            setError('Сервер недоступен');
        }
    };

    if (token) {
        return <ConfirmPhoneForm token={token}/>;
    }

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
                Получить код
            </button>
        </form>
    );
};

export default RegisterForm;
