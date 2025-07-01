import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import styles from './LoginRegisterForm.module.css';
import {API_PUBLIC} from "@/utils/api/axiosPublic.js";
import ConfirmPhoneForm from './ConfirmPhoneForm';

const RegisterForm = ({switchToLogin}) => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [token, setToken] = useState(null);
    const [error, setError] = useState('');

    // Загружаем CSRF-токен при монтировании формы
    useEffect(() => {
        API_PUBLIC.get('/api/accounts/csrf/');
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await API_PUBLIC.post(
                '/api/accounts/register/',
                {
                    first_name: name,
                    phone,
                    email,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.status >= 200 && response.status < 300) {
                setToken(response.data.token);
            }
        } catch (err) {
            const data = err?.response?.data;

            // Собираем все возможные ошибки в массив
            let messages = [];

            if (typeof data === 'string') {
                messages.push(data); // например: "Можно отправлять код только раз в минуту"
            } else if (typeof data === 'object') {
                for (const key in data) {
                    if (Array.isArray(data[key])) {
                        messages.push(...data[key]); // ошибки по полям
                    } else {
                        messages.push(data[key]); // общие ошибки
                    }
                }
            }

            // Показываем первую ошибку (или все сразу, по желанию)
            setError(messages[0] || 'Ошибка регистрации');
        }

    };

    // Если получили токен — показываем форму подтверждения
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
            
            <div className={styles.privacyNote}>
                Нажимая на кнопку, вы соглашаетесь с <Link to="/privacy">политикой конфиденциальности</Link>
            </div>
        </form>
    );
};

export default RegisterForm;
