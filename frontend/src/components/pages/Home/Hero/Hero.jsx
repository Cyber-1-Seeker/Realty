import React, {useState} from 'react';
import {API_PUBLIC} from "@/utils/api/axiosPublic.js";
import classes from './Hero.module.css';
import {Link, useNavigate} from 'react-router-dom';
import {getCSRFTokenFromCookie} from "@/utils/api/csrf.js";
import ModalForm from '@/components/pages/Listings/ListingsPage/ModalForm.jsx';
import AdvancePaymentForm from "@/components/pages/Home/AdvancePaymentForm/AdvancePaymentForm.jsx";
import {FaUserCircle} from 'react-icons/fa';
import AuthModal from "@/components/AuthModal/AuthModal.jsx";
import useAuthGuard from '@/hooks/useAuthGuard';

const Hero = ({isAuthenticated}) => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [showAdvanceModal, setShowAdvanceModal] = useState(false);
    const [showConsultModal, setShowConsultModal] = useState(false);
    const [commentError, setCommentError] = useState(false);
    const [nickname, setNickname] = useState('');
    const [showAuthModal, setShowAuthModal] = useState(false);

    const navigate = useNavigate();
    const guard = useAuthGuard(isAuthenticated, () => setShowAuthModal(true));

    // Защищенная функция для перехода в профиль
    const handleProfileClick = guard(() => {
        navigate('/profile');
    });

    const handleAdvanceSubmit = async (e) => {
        e.preventDefault();
        if (!name || !phone) {
            alert('Заполните имя и телефон');
            return;
        }

        setLoading(true);
        try {
            await API_PUBLIC.post(
                '/api/applications/applications/',
                {
                    name,
                    phone,
                    comment: 'Запрос на аванс',
                    nickname,
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
            setTimeout(() => {
                setSuccess(false);
                setShowAdvanceModal(false);
            }, 2000);
        } catch (error) {
            alert('Ошибка отправки');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleConsultSubmit = async () => {
        if (!comment.trim()) {
            setCommentError(true);
            return;
        }
        setCommentError(false);

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
                        'X-CSRFToken': getCSRFTokenFromCookie(),
                    },
                    withCredentials: true,
                }
            );
            setSuccess(true);
            setName('');
            setPhone('');
            setComment('');
            setShowConsultModal(false);
        } catch (error) {
            alert('Ошибка отправки');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className={classes.heroSection}>
            <div className={classes.heroOverlay}></div>

            <nav className={classes.heroNav}>
                <button onClick={() => setShowAdvanceModal(true)}>
                    Получить аванс
                </button>
                <a href="#calculator">Калькулятор стоимости</a>

                <button onClick={handleProfileClick}>
                    Профиль
                </button>

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
                    <div className={classes.heroFormTitle}>Консультация</div>
                    <div className={classes.heroFormBody}>
                        <input
                            type="text"
                            placeholder="Ваше имя"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <input
                            type="tel"
                            placeholder="Телефон"
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
                        <button
                            onClick={() => {
                                if (!name || !phone) {
                                    alert('Заполните имя и телефон');
                                    return;
                                }
                                setShowConsultModal(true);
                            }}
                            disabled={loading}
                        >
                            {loading ? 'Отправка...' : 'Оставить заявку'}
                        </button>
                        {success && (
                            <div className={classes.successMessage}>
                                Заявка отправлена! Мы вам перезвоним.
                            </div>
                        )}
                    </div>
                    <div className={classes.heroFormNote}>
                        Нажимая на кнопку, вы соглашаетесь с <a href="#">политикой конфиденциальности</a>
                    </div>
                </div>
            </div>

            {/* Модальное окно для аванса */}
            <ModalForm isOpen={showAdvanceModal} onClose={() => setShowAdvanceModal(false)}>
                <AdvancePaymentForm
                    onClose={() => {
                        setShowAdvanceModal(false);
                        setSuccess(true);
                        setTimeout(() => setSuccess(false), 2000);
                    }}
                />
            </ModalForm>

            {/* Модальное окно для консультации */}
            <ModalForm isOpen={showConsultModal} onClose={() => setShowConsultModal(false)}>
                <div className={classes.consultModal}>
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
                        <button
                            onClick={handleConsultSubmit}
                            className={classes.submitButton}
                            disabled={loading}
                        >
                            {loading ? 'Отправка...' : 'Отправить'}
                        </button>
                        <button
                            onClick={() => setShowConsultModal(false)}
                            className={classes.cancelButton}
                        >
                            Отмена
                        </button>
                    </div>
                </div>
            </ModalForm>

            {/* Добавлено модальное окно авторизации */}
            {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
        </section>
    );
};

export default Hero;