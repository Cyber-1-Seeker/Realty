import React, {useEffect, useState} from 'react';
import {API_PUBLIC} from "@/utils/api/axiosPublic.js";
import classes from './Hero.module.css';
import {Link} from 'react-router-dom';
import { getCSRFTokenFromCookie } from "@/utils/api/csrf.js";


const Hero = () => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [commentError, setCommentError] = useState(false);
    const [nickname, setNickname] = useState('');

    // Загружаем CSRF-токен при монтировании формы
    useEffect(() => {
        API_PUBLIC.get('/api/accounts/csrf/');
    }, []);

    const handleOpenModal = () => {
        if (!name || !phone) {
            alert('Пожалуйста, заполните имя и телефон');
            return;
        }
        setShowModal(true);
    };

    const handleSendApplication = async () => {
        if (!comment.trim()) {
            setCommentError(true);
            return;
        }
        setCommentError(false); // сброс, если всё ок

        setLoading(true);
        try {
            await API_PUBLIC.post(
                '/api/applications/applications/',
                {
                    name,
                    phone,
                    comment,
                    nickname,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': getCSRFTokenFromCookie(), // 👈 нужен
                    },
                    withCredentials: true, // 👈 тоже нужен
                }
            );

            setSuccess(true);
            setName('');
            setPhone('');
            setComment('');
            setShowModal(false);
        } catch (error) {
            alert('Ошибка при отправке заявки');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className={classes.heroSection}>
            <div className={classes.heroOverlay}></div>

            <nav className={classes.heroNav}>
                <Link to="#">Получить аванс</Link>
                <a href="#calculator">Калькулятор стоимости</a>
                <Link to="#">Купить</Link>
                <Link to="/listings">База квартир</Link>
                <a href="/#contacts">Контакты</a>
            </nav>

            <div className={classes.heroContent}>
                <div className={classes.heroText}>
                    <h1>Срочный выкуп квартир в Москве и Московской области</h1>
                    <p>До 100% от рыночной стоимости</p>
                    <p>Аванс сразу после подписания договора</p>
                </div>

                <div className={classes.heroForm}>
                    <div className={classes.heroFormTitle}>Получите консультацию</div>
                    <div className={classes.heroFormBody}>
                        <input
                            type="text"
                            placeholder="Введите имя"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <input
                            type="tel"
                            placeholder="Введите телефон"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                        <input
                            type="text"
                            name="nickname"
                            style={{display: 'none'}}
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            autoComplete="off"
                            tabIndex="-1"
                        />
                        <button onClick={handleOpenModal} disabled={loading}>
                            {loading ? 'Отправка...' : 'Оставить заявку'}
                        </button>
                        {success && <div style={{color: 'green', marginTop: 10}}>Заявка успешно отправлена!</div>}
                    </div>
                    <div className={classes.heroFormNote}>
                        Нажимая на кнопку, вы соглашаетесь с{' '}
                        <a href="#">политикой конфиденциальности сайта</a>
                    </div>
                </div>
            </div>

            {showModal && (
                <div className={classes.modalOverlay}>
                    <div className={classes.modal}>
                        <h3>Уточните тему заявки</h3>
                        <textarea
                            className={commentError ? classes.errorInput : ''}
                            placeholder="Опишите, какая у вас ситуация"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows={4}
                            maxLength={200}
                        />
                        {commentError && <div className={classes.errorText}>Комментарий обязателен</div>}

                        <div className={classes.modalButtons}>
                            <button onClick={handleSendApplication} className={classes.submitButton}>
                                Отправить
                            </button>
                            <button onClick={() => setShowModal(false)} className={classes.cancelButton}>
                                Отмена
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Hero;
