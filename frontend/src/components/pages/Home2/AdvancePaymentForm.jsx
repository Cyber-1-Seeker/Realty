import { useState, useEffect } from 'react';
import { API_PUBLIC } from '@/utils/api/axiosPublic.js';
import { getCSRFTokenFromCookie } from "@/utils/api/csrf.js";
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import styles from './AdvancePaymentForm.module.css';

const AdvancePaymentForm = ({ onClose, theme }) => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        nickname: '',
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        API_PUBLIC.get('/api/accounts/csrf/');
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Проверка honeypot: если поле nickname заполнено, то это бот
        if (formData.nickname) {
            console.log("Bot detected");
            return;
        }

        if (!formData.name.trim() || !formData.phone.trim()) {
            setError('Пожалуйста, заполните все поля');
            return;
        }

        setLoading(true);
        try {
            await API_PUBLIC.post(
                '/api/applications/applications/',
                {
                    name: formData.name.trim(),
                    phone: formData.phone.trim(),
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
            setSuccess(true);
            // Закрываем форму через 2 секунды после успешной отправки
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (error) {
            console.error('Ошибка:', error);
            setError('Ошибка при отправке заявки. Попробуйте еще раз.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div 
            className={styles.modalContent + (theme === 'dark' ? ' ' + styles.dark : '')}
            style={theme === 'dark' ? {
                background: 'rgba(0, 0, 0, 0.95)',
                border: '1px solid rgba(59, 130, 246, 0.4)',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.7), 0 0 40px rgba(59, 130, 246, 0.2)'
            } : {}}
        >
            <div className={styles.modalHeader}>
                <div className={styles.modalIcon}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.iconSvg}>
                        <path
                            d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z"
                            stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path
                            d="M12 2V16"
                            stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>
                <h3>Получить аванс за квартиру</h3>
                <p className={styles.subtitle}>Наш юрист свяжется с вами для уточнения деталей</p>
            </div>

            {success ? (
                <motion.div
                    className={styles.successMessage}
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    style={{textAlign: 'center'}}
                >
                    <div style={{display: 'flex', justifyContent: 'center', marginBottom: '20px'}}>
                        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M9 12L11 14L15 10M21 16V8C21 6.89543 20.1046 6 19 6H5C3.89543 6 3 6.89543 3 8V16C3 17.1046 3.89543 18 5 18H19C20.1046 18 21 17.1046 21 16Z"
                                stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                    <h4>Заявка отправлена!</h4>
                    <p>Наш юрист свяжется с вами в ближайшее время</p>
                </motion.div>
            ) : (
                <form className={styles.form + (theme === 'dark' ? ' ' + styles.dark : '')} onSubmit={handleSubmit}>
                    {/* Honeypot поле (скрытое) */}
                    <input
                        type="text"
                        name="nickname"
                        value={formData.nickname}
                        onChange={handleChange}
                        style={{display: 'none'}}
                        autoComplete="off"
                        tabIndex="-1"
                    />

                    <div className={styles.formGroup}>
                        <label>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
                                    stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z" stroke="#4B5563"
                                      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Ваше имя *
                        </label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Иван Иванов"
                            value={formData.name}
                            onChange={handleChange}
                            className={styles.input + (theme === 'dark' ? ' ' + styles.dark : '')}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M3 5C3 3.89543 3.89543 3 5 3H8.27924C8.70967 3 9.09181 3.27543 9.22792 3.68377L10.7257 8.17721C10.8831 8.64932 10.6694 9.16531 10.2243 9.38787L7.96701 10.5165C9.06925 12.9612 11.0388 14.9308 13.4835 16.033L14.6121 13.7757C14.8347 13.3306 15.3507 13.1169 15.8228 13.2743L20.3162 14.7721C20.7246 14.9082 21 15.2903 21 15.7208V19C21 20.1046 20.1046 21 19 21H18C9.71573 21 3 14.2843 3 6V5Z"
                                    stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Телефон *
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            placeholder="+7 (999) 999-99-99"
                            value={formData.phone}
                            onChange={handleChange}
                            className={styles.input + (theme === 'dark' ? ' ' + styles.dark : '')}
                            required
                        />
                    </div>

                    {error && <div className={styles.error}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
                                stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        {error}
                    </div>}

                    <motion.button
                        type="submit"
                        className={styles.submitButton}
                        disabled={loading}
                        whileHover={{scale: 1.03}}
                        whileTap={{scale: 0.98}}
                    >
                        {loading ? (
                            <>
                                <svg className={styles.spinner} width="20" height="20" viewBox="0 0 24 24"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
                                        opacity=".25"/>
                                    <path
                                        d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z">
                                        <animateTransform attributeName="transform" type="rotate" dur="0.75s"
                                                          values="0 12 12;360 12 12" repeatCount="indefinite"/>
                                    </path>
                                </svg>
                                Отправка...
                            </>
                        ) : (
                            <>
                                Получить аванс
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9 5L16 12L9 19" stroke="white" strokeWidth="2" strokeLinecap="round"
                                          strokeLinejoin="round"/>
                                </svg>
                            </>
                        )}
                    </motion.button>
                    
                    <div className={styles.privacyNote}>
                        Нажимая на кнопку, вы соглашаетесь с{' '}
                        <Link to="/privacy" className={styles.advancePrivacyLink}>
                            политикой конфиденциальности
                        </Link>
                    </div>
                </form>
            )}
        </div>
    );
};

export default AdvancePaymentForm;