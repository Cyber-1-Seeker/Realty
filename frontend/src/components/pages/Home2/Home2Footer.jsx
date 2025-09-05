import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Home2Footer.module.css';

const Home2Footer = ({ theme }) => {
    const handleScrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className={styles.footer + (theme === 'dark' ? ' ' + styles.dark : '')}>
            <div className={styles.container}>
                {/* Основной контент футера */}
                <div className={styles.content}>
                    {/* Логотип и описание */}
                    <div className={styles.logoSection}>
                        <div className={styles.logo}>
                            <span>STRACK </span>
                            <strong>ESTATE</strong>
                        </div>
                        <p className={styles.description}>
                            Ведущая платформа для поиска и оценки недвижимости в Москве. 
                            Помогаем найти дом вашей мечты с 2020 года.
                        </p>
                        <div className={styles.socialLinks}>
                            <a href="https://t.me/your_channel" className={styles.socialLink} aria-label="Telegram">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M21.944 2.568a1.25 1.25 0 0 0-1.393-.268L2.705 9.6a1.25 1.25 0 0 0 .154 2.368l5.006 1.404 1.404 5.006a1.25 1.25 0 0 0 2.368.154L19.037 4.36a1.25 1.25 0 0 0-.093-1.793z" fill="currentColor"/>
                                </svg>
                            </a>
                            <a href="https://instagram.com/your_page" className={styles.socialLink} aria-label="Instagram">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="currentColor" strokeWidth="2"/>
                                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" stroke="currentColor" strokeWidth="2"/>
                                    <path d="M17.5 6.5h.01" stroke="currentColor" strokeWidth="2"/>
                                </svg>
                            </a>
                            <a href="https://vk.com/your_group" className={styles.socialLink} aria-label="VKontakte">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M15.84 8.5c0-.37-.09-.77-.27-1.15-.43-.93-1.33-1.7-2.57-1.7s-2.14.77-2.57 1.7c-.18.38-.27.78-.27 1.15 0 .82.35 1.58.93 2.12.33.31.74.53 1.18.66.22.07.45.1.68.1s.46-.03.68-.1c.44-.13.85-.35 1.18-.66.58-.54.93-1.3.93-2.12z" fill="currentColor"/>
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm6.6 13.5c-.28.8-.7 1.52-1.25 2.1-.55.58-1.2 1.04-1.92 1.35-.72.31-1.5.47-2.3.47-.8 0-1.58-.16-2.3-.47-.72-.31-1.37-.77-1.92-1.35-.55-.58-.97-1.3-1.25-2.1-.28-.8-.42-1.65-.42-2.5s.14-1.7.42-2.5c.28-.8.7-1.52 1.25-2.1.55-.58 1.2-1.04 1.92-1.35.72-.31 1.5-.47 2.3-.47.8 0 1.58.16 2.3.47.72.31 1.37.77 1.92 1.35.55.58.97 1.3 1.25 2.1.28.8.42 1.65.42 2.5s-.14 1.7-.42 2.5z" fill="currentColor"/>
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Быстрые ссылки */}
                    <div className={styles.linksSection}>
                        <h4>Быстрые ссылки</h4>
                        <ul>
                            <li><Link to="/">Главная</Link></li>
                            <li><Link to="/about">О нас</Link></li>
                            <li><Link to="/listings">Объекты</Link></li>
                            <li><Link to="/support">Поддержка</Link></li>
                        </ul>
                    </div>

                    {/* Услуги */}
                    <div className={styles.linksSection}>
                        <h4>Услуги</h4>
                        <ul>
                            <li><a href="#calculator">Калькулятор стоимости</a></li>
                            <li><Link to="/listings">Продажа квартир</Link></li>
                            <li><Link to="/listings">Покупка жилья</Link></li>
                            <li><Link to="/listings">Аренда</Link></li>
                        </ul>
                    </div>

                    {/* Контакты */}
                    <div className={styles.contactSection}>
                        <h4>Контакты</h4>
                        <div className={styles.contactInfo}>
                            <div className={styles.contactItem}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2"/>
                                    <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
                                </svg>
                                <span>Москва, ул. Тверская 1</span>
                            </div>
                            <div className={styles.contactItem}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="2"/>
                                </svg>
                                <span>+7 (999) 123-45-67</span>
                            </div>
                            <div className={styles.contactItem}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2"/>
                                    <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2"/>
                                </svg>
                                <span>info@realty.ru</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Разделитель */}
                <div className={styles.divider}></div>

                {/* Нижняя часть */}
                <div className={styles.bottom}>
                    <div className={styles.copyright}>
                        <p>&copy; {new Date().getFullYear()} STRACK ESTATE. Все права защищены.</p>
                    </div>
                    <div className={styles.legalLinks}>
                        <Link to="/privacy" className={styles.legalLink}>
                            Политика конфиденциальности
                        </Link>
                        <span className={styles.separator}>•</span>
                        <Link to="/terms" className={styles.legalLink}>
                            Условия использования
                        </Link>
                    </div>
                </div>
            </div>

            {/* Кнопка "Наверх" */}
            <button
                onClick={handleScrollToTop}
                className={styles.scrollToTopBtn}
                aria-label="Прокрутить наверх"
                title="Прокрутить наверх"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path 
                        d="M12 19V6M5 12L12 5L19 12" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                    />
                </svg>
            </button>

            {/* Декоративные элементы */}
            <div className={styles.decorativeElements}>
                <div className={styles.bgDot1}></div>
                <div className={styles.bgDot2}></div>
                <div className={styles.bgDot3}></div>
            </div>
        </footer>
    );
};

export default Home2Footer; 