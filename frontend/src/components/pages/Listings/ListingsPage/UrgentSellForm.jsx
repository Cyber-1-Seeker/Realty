import {useState, useEffect} from 'react';
import styles from './UrgentSellForm.module.css';
import axios from 'axios';
import {getCSRFTokenFromCookie} from '@/utils/api/csrf.js'; // если уже есть
import {API_PUBLIC} from '@/utils/api/axiosPublic.js'; // axios instance с baseURL и т.д.

const UrgentSellForm = ({onClose}) => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        nickname: '', // для honeypot
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // Запрашиваем CSRF при монтировании
    useEffect(() => {
        API_PUBLIC.get('/api/accounts/csrf/');
    }, []);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({...prev, [name]: value}));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.phone) {
            alert('Пожалуйста, заполните имя и телефон');
            return;
        }

        setLoading(true);
        try {
            await API_PUBLIC.post(
                '/api/applications/applications/',
                {
                    name: formData.name,
                    phone: formData.phone,
                    comment: 'Срочная продажа',
                    nickname: formData.nickname,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': getCSRFTokenFromCookie(),
                    },
                    withCredentials: true,
                }
            );

            setSuccess(true);
            alert('Заявка успешно отправлена!');
            onClose();
        } catch (error) {
            console.error('Ошибка при отправке заявки:', error);
            alert('Ошибка отправки.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <h2>Срочная продажа квартиры</h2>

            <input
                type="text"
                name="name"
                placeholder="Ваше имя"
                value={formData.name}
                onChange={handleChange}
                required
            />

            <input
                type="tel"
                name="phone"
                placeholder="Телефон"
                value={formData.phone}
                onChange={handleChange}
                required
            />

            {/* Honeypot field (скрытый) */}
            <input
                type="text"
                name="nickname"
                style={{display: 'none'}}
                value={formData.nickname}
                onChange={handleChange}
                autoComplete="off"
                tabIndex="-1"
            />

            <button type="submit" disabled={loading}>
                {loading ? 'Отправка...' : 'Отправить заявку'}
            </button>
        </form>
    );
};

export default UrgentSellForm;
