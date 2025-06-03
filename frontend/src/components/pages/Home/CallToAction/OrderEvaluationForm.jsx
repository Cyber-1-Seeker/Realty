import React, {useState} from 'react';
import {motion} from 'framer-motion';
import styles from './CallToAction.module.css';
import {API_PUBLIC} from '@/utils/api/axiosPublic.js';
import {getCSRFTokenFromCookie} from "@/utils/api/csrf.js";

const OrderEvaluationForm = ({onClose}) => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [nickname, setNickname] = useState(''); // Honeypot поле
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Проверка honeypot: если поле nickname заполнено, то это бот
        if (nickname) {
            console.log("Bot detected");
            return;
        }

        if (!name.trim() || !phone.trim()) {
            setError('Пожалуйста, заполните все поля');
            return;
        }

        setIsSubmitting(true);

        try {
            const csrfToken = getCSRFTokenFromCookie();

            // Отправляем запрос на API
            const response = await API_PUBLIC.post(
                '/api/applications/applications/',
                {
                    name: name.trim(),
                    phone: phone.trim(),
                    comment: 'Запрос на оценку',
                    nickname: nickname, // honeypot
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrfToken,
                    },
                    withCredentials: true,
                }
            );

            if (response.status === 201) {
                setSuccess(true);
                // Закрываем форму через 2 секунды после успешной отправки
                setTimeout(() => {
                    onClose();
                }, 2000);
            } else {
                setError('Ошибка при отправке заявки. Попробуйте еще раз.');
            }
        } catch (err) {
            console.error('API Error:', err);
            setError('Ошибка при отправке заявки. Попробуйте еще раз.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.modalContent}>
            {/*<button*/}
            {/*    className={styles.closeButton}*/}
            {/*    onClick={onClose}*/}
            {/*>*/}
            {/*    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">*/}
            {/*        <path d="M18 6L6 18M6 6L18 18" stroke="#4B5563" strokeWidth="2" strokeLinecap="round"*/}
            {/*              strokeLinejoin="round"/>*/}
            {/*    </svg>*/}
            {/*</button>*/}

            <div className={styles.modalHeader}>
                <div className={styles.modalIcon}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M9 12L11 14L15 10M21 16V8C21 6.89543 20.1046 6 19 6H5C3.89543 6 3 6.89543 3 8V16C3 17.1046 3.89543 18 5 18H19C20.1046 18 21 17.1046 21 16Z"
                            stroke="#1E40AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>
                <h3>Заказать оценку квартиры</h3>
                <p className={styles.subtitle}>Наш специалист свяжется с вами для уточнения деталей</p>
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
                                stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                    <h4>Заявка отправлена!</h4>
                    <p>Наш специалист свяжется с вами в ближайшее время</p>
                </motion.div>
            ) : (
                <form className={styles.form} onSubmit={handleSubmit}>
                    {/* Honeypot поле (скрытое) - ДОБАВЛЕН СТИЛЬ */}
                    <input
                        type="text"
                        name="nickname"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        style={{display: 'none'}} // Скрываем поле
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
                            placeholder="Иван Иванов"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M8 3V7M8 7H5M8 7V11M16 3V7M16 7H19M16 7V11M3 11H21M5 21H19C20.1046 21 21 20.1046 21 19V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V19C3 20.1046 3.89543 21 5 21Z"
                                    stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Телефон *
                        </label>
                        <input
                            type="tel"
                            placeholder="+7 (999) 999-99-99"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className={styles.input}
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
                        disabled={isSubmitting}
                        whileHover={{scale: 1.03}}
                        whileTap={{scale: 0.98}}
                    >
                        {isSubmitting ? (
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
                                Отправить заявку
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9 5L16 12L9 19" stroke="white" strokeWidth="2" strokeLinecap="round"
                                          strokeLinejoin="round"/>
                                </svg>
                            </>
                        )}
                    </motion.button>
                </form>
            )}
        </div>
    );
};

export default OrderEvaluationForm;