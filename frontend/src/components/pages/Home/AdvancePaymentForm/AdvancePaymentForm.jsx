import { useState, useEffect } from 'react';
import { API_PUBLIC } from '@/utils/api/axiosPublic.js';
import { getCSRFTokenFromCookie } from "@/utils/api/csrf.js";
import { Link } from 'react-router-dom';
import styles from './AdvancePaymentForm.module.css'; // Импорт стилей как объекта

const AdvancePaymentForm = ({ onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        nickname: '',
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        API_PUBLIC.get('/api/accounts/csrf/');
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.phone) {
            alert('Заполните имя и телефон');
            return;
        }

        setLoading(true);
        try {
            await API_PUBLIC.post(
                '/api/applications/applications/',
                {
                    name: formData.name,
                    phone: formData.phone,
                    comment: 'Запрос на аванс',
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
            alert('Заявка отправлена! Юрист свяжется с вами.');
            onClose();
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Ошибка отправки.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles['advance-form']}>
            <h2 className={styles['form-title']}>Получить аванс за квартиру</h2>
            <p className={styles['form-description']}>
                Оставьте заявку, и наш специалист свяжется с вами для уточнения деталей.
            </p>

            <input
                type="text"
                name="name"
                placeholder="Ваше имя"
                value={formData.name}
                onChange={handleChange}
                className={styles['form-input']}
                required
            />

            <input
                type="tel"
                name="phone"
                placeholder="Телефон"
                value={formData.phone}
                onChange={handleChange}
                className={styles['form-input']}
                required
            />

            <input
                type="text"
                name="nickname"
                className={styles['honeypot-field']}
                value={formData.nickname}
                onChange={handleChange}
                autoComplete="off"
                tabIndex="-1"
            />

            <div className={styles['button-container']}>
                <button
                    type="submit"
                    disabled={loading}
                    className={styles['submit-button']}
                >
                    {loading ? 'Отправка...' : 'Получить аванс'}
                </button>
            </div>
            
            <div className={styles['privacy-note']}>
                Нажимая на кнопку, вы соглашаетесь с <Link to="/privacy">политикой конфиденциальности</Link>
            </div>
        </form>
    );
};

export default AdvancePaymentForm;