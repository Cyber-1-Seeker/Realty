import React, { useState } from 'react';
import {useInView} from 'react-intersection-observer';
import { useOutletContext } from 'react-router-dom';
import styles from './Home2.module.css';
import heroImg from '@/assets/Listings/Hero4.png';
import DealTimelinePage from "@/components/pages/Home2/DealTimelinePage.jsx";
import WhyChooseUs from "@/components/pages/Home2/WhyChooseUs.jsx";
import AboutUsSection from "@/components/pages/Home2/AboutUsSection.jsx";
import CalculatorLaunch from "@/components/pages/Home2/CalculatorLaunch.jsx";
import {useTheme} from '@/context/ThemeContext';
import StatisticsSection from "@/components/pages/Home2/StatisticsSection.jsx";
import MapSection from "@/components/pages/Home2/MapSection.jsx";
import Testimonials from "@/components/pages/Home2/Testimonials/Testimonials.jsx";
import Home2Footer from "@/components/pages/Home2/Home2Footer.jsx";
import Home2Header from "@/components/pages/Home2/Home2Header.jsx";
import { API_PUBLIC } from '@/utils/api/axiosPublic.js';
import { getCSRFTokenFromCookie } from "@/utils/api/csrf.js";
import ModalForm from '@/components/pages/Listings/ListingsPage/ModalForm.jsx';
const Home2 = () => {
    const { isAuthenticated = false } = useOutletContext() || {};
    const {theme, toggleTheme} = useTheme();
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        comment: '',
    });
    const [loading, setLoading] = useState(false);
    const [showCommentModal, setShowCommentModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [error, setError] = useState('');
    const [commentError, setCommentError] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.name.trim() || !formData.phone.trim()) {
            setError('Пожалуйста, заполните все поля');
            return;
        }

        // Открываем модальное окно для ввода комментария
        setShowCommentModal(true);
    };

    const handleCommentSubmit = async () => {
        if (!formData.comment.trim()) {
            setCommentError(true);
            return;
        }
        setCommentError(false);
        setError('');

        setLoading(true);
        try {
            const response = await API_PUBLIC.post(
                '/api/applications/applications/',
                {
                    name: formData.name.trim(),
                    phone: formData.phone.trim(),
                    comment: formData.comment.trim(),
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': getCSRFTokenFromCookie(),
                    },
                    withCredentials: true,
                }
            );

            if (response.status === 201) {
                setShowCommentModal(false);
                setShowSuccessModal(true);
                setFormData({ name: '', phone: '', comment: '' });
                setTimeout(() => {
                    setShowSuccessModal(false);
                }, 2000);
            } else {
                setError('Ошибка при отправке заявки. Попробуйте еще раз.');
            }
        } catch (error) {
            console.error('Ошибка при отправке заявки:', error);
            setError('Ошибка при отправке заявки. Попробуйте еще раз.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (name === 'comment') {
            setCommentError(false);
        }
    };

    // Хуки для анимации при скролле
    const {ref: dealRef, inView: dealInView} = useInView({triggerOnce: true, threshold: 0.2});
    const {ref: aboutRef, inView: aboutInView} = useInView({triggerOnce: true, threshold: 0.2});
    const {ref: whyRef, inView: whyInView} = useInView({triggerOnce: true, threshold: 0.2});
    const {ref: calcRef, inView: calcInView} = useInView({triggerOnce: true, threshold: 0.2});
    const {ref: mapRef, inView: mapInView} = useInView({triggerOnce: true, threshold: 0.2});
    const {ref: testimonialRef, inView: testimonialInView} = useInView({triggerOnce: true, threshold: 0.2});
    const {ref: footerRef, inView: footerInView} = useInView({triggerOnce: true, threshold: 0.2});

    return (
        <div
            className={
                styles.altBgWrapper + (theme === 'dark' ? ' ' + styles.dark : '')
            }
            style={{
                backgroundColor: theme === 'dark' ? '#181a1b' : 'white',
                minHeight: '100vh',
                width: '100vw',
                position: 'fixed',
                inset: 0,
                zIndex: 0,
                overflowY: 'auto',
                overflowX: 'hidden',
            }}
        >


            <div className={styles.pageWrapper}>
                <div className={styles.headerHeroContainer}>
                    <Home2Header isAuthenticated={isAuthenticated} />

                    <section className={styles.heroSection}>
                        <div className={styles.bgDotRed}></div>
                        <div className={styles.bgDotGreen}></div>
                        <div className={styles.bgDotBlue}></div>
                        <div className={styles.bgLineRight}></div>
                        <div className={styles.bgLineLeft}></div>
                        <div className={styles.heroTextBlock}>
                            <span className={styles.heroSubtitle}>Платформа для поиска недвижимости</span>
                            <h1 className={styles.heroTitle}>Найдите дом своей мечты</h1>
                            <div className={styles.filterCards}>
                                <div className={styles.filterCard + ' ' + styles.checked}>
                                    <span className={styles.checkIcon}>✓</span>
                                    <span>Купить</span>
                                </div>
                                <div className={styles.filterCard + ' ' + styles.checked}>
                                    <span className={styles.checkIcon}>✓</span>
                                    <span>Продать</span>
                                </div>
                                <div className={styles.filterCard + ' ' + styles.checked}>
                                    <span className={styles.checkIcon}>✓</span>
                                    <span>Арендовать</span>
                                </div>
                            </div>
                            <section className={styles.searchBlock}>
                                <form className={styles.searchForm} onSubmit={handleSubmit}>
                                    <input
                                        className={styles.input}
                                        type="text"
                                        name="name"
                                        placeholder="Ваше имя"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                    <input
                                        className={styles.input}
                                        type="tel"
                                        name="phone"
                                        placeholder="Номер телефона"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                    />
                                    <button
                                        className={styles.requestBtn}
                                        type="submit"
                                        disabled={loading}
                                    >
                                        {loading ? 'Отправка...' : 'Отправить заявку'}
                                    </button>
                                </form>
                                {error && (
                                    <div className={styles.error}>
                                        {error}
                                    </div>
                                )}
                            </section>
                        </div>
                        <div className={styles.heroImgBlock}>
                            <img src={heroImg} alt="Современный дом" className={styles.heroImg}/>
                        </div>
                    </section>
                </div>

                <section ref={dealRef} className={`${styles.animSection} ${dealInView ? styles.visible : ''}`}>
                    <DealTimelinePage theme={theme}/>
                </section>
                <section><StatisticsSection theme={theme}/></section>
                <section ref={aboutRef} className={`${styles.animSection} ${aboutInView ? styles.visible : ''}`}>
                    <AboutUsSection theme={theme}/>
                </section>
                <section ref={whyRef} className={`${styles.animSection} ${whyInView ? styles.visible : ''}`}>
                    <WhyChooseUs theme={theme}/>
                </section>
                <section ref={calcRef} className={`${styles.animSection} ${calcInView ? styles.visible : ''}`}>
                    <CalculatorLaunch theme={theme}/>
                </section>
                <section ref={mapRef} className={`${styles.animSection} ${mapInView ? styles.visible : ''}`}>
                    <MapSection theme={theme}/>
                </section>
                <section ref={testimonialRef}
                         className={`${styles.animSection} ${testimonialInView ? styles.visible : ''}`}>
                    <Testimonials theme={theme}/>
                </section>
                {/* Красивый футер */}
                <section ref={footerRef} className={`${styles.animSection} ${footerInView ? styles.visible : ''}`}>
                    <Home2Footer theme={theme}/>
                </section>
            </div>

            {/* Модальное окно для комментария */}
            <ModalForm isOpen={showCommentModal} onClose={() => setShowCommentModal(false)}>
                <div className={`${styles.commentModal} ${theme === 'dark' ? styles.dark : styles.light}`}>
                    <h3>Уточните тему заявки</h3>
                    <textarea
                        className={`${styles.commentInput} ${commentError ? styles.errorInput : ''}`}
                        placeholder="Опишите, какая у вас ситуация"
                        name="comment"
                        value={formData.comment}
                        onChange={handleChange}
                        rows={4}
                        maxLength={200}
                    />
                    {(commentError || error) && (
                        <div className={styles.errorText}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
                                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            {commentError ? 'Комментарий обязателен' : error}
                        </div>
                    )}

                    <div className={styles.modalButtons}>
                        <button
                            onClick={handleCommentSubmit}
                            className={styles.submitButton}
                            disabled={loading}
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
                                    Отправить
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9 5L16 12L9 19" stroke="currentColor" strokeWidth="2"
                                              strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </>
                            )}
                        </button>
                        <button
                            onClick={() => setShowCommentModal(false)}
                            className={styles.cancelButton}
                        >
                            Отмена
                        </button>
                    </div>
                </div>
            </ModalForm>

            {/* Модальное окно успешной отправки */}
            <ModalForm isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)}>
                <div className={styles.successModal}>
                    <div className={styles.successIcon}>
                        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M9 12L11 14L15 10M21 16V8C21 6.89543 20.1046 6 19 6H5C3.89543 6 3 6.89543 3 8V16C3 17.1046 3.89543 18 5 18H19C20.1046 18 21 17.1046 21 16Z"
                                stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                    <h3>Заявка отправлена!</h3>
                    <p>Наш специалист свяжется с вами в ближайшее время</p>
                </div>
            </ModalForm>
        </div>
    );
};

export default Home2;