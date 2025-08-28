import React, { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext.jsx';
import styles from './Home2Header.module.css';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import useAuthGuard from '@/hooks/useAuthGuard';
import AuthModal from '@/components/AuthModal/AuthModal.jsx';
import { motion, AnimatePresence } from 'framer-motion';

const Home2Header = ({ isAuthenticated = false }) => {
    const { theme, toggleTheme } = useTheme();
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 950);
    const [menuOpen, setMenuOpen] = useState(false);
    
    const isActive = (paths) => paths.some(p => pathname === p || pathname.startsWith(p + '/'));

    const guard = useAuthGuard(isAuthenticated, () => setShowAuthModal(true));

    // Обработка изменения размера экрана
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth <= 950;
            setIsMobile(mobile);
            if (!mobile) {
                setMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Закрытие меню при клике на оверлей
    const handleOverlayClick = () => {
        setMenuOpen(false);
    };

    // Закрытие меню по Escape и блокировка скролла при открытом меню (как в глобальном хедере)
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                setMenuOpen(false);
            }
        };

        if (menuOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [menuOpen]);

    // Закрытие меню при переходе на другую страницу
    const handleNavClick = () => {
        setMenuOpen(false);
    };

    const handleProfileClick = (e) => {
        e.preventDefault();
        if (isAuthenticated) {
            navigate('/profile');
        } else {
            setShowAuthModal(true);
        }
    };



    return (
        <>
            <header className={`${styles.home2Header} ${styles.home2HeaderUnique} ${theme === 'dark' ? styles.dark : ''}`}>
                {/* Мобильная кнопка переключения темы - слева */}
                {isMobile && (
                    <button
                        className={styles.mobileThemeToggleBtn}
                        onClick={toggleTheme}
                        aria-label={theme === 'light' ? 'Переключить на тёмную тему' : 'Переключить на светлую тему'}
                    >
                        <img
                            src={theme === 'light' ? '/icons/Home/sun-icon.png' : '/icons/Home/moon-icon.png'}
                            alt={theme === 'light' ? 'Солнце' : 'Луна'}
                            width="24"
                            height="24"
                        />
                    </button>
                )}

                <div className={styles.logo}><span>STRACK </span><b>ESTATE</b></div>
                
                {/* Десктопное меню */}
                {!isMobile && (
                    <nav className={styles.navMenu}>
                    <Link 
                        to="/home2" 
                        className={`${isActive(['/home2']) ? styles.active : ''} ${theme === 'dark' ? styles.dark : ''}`}
                    >
                        Главная
                    </Link>
                    <Link 
                        to="/about" 
                        className={`${isActive(['/about']) ? styles.active : ''} ${theme === 'dark' ? styles.dark : ''}`}
                    >
                        О нас
                    </Link>
                    <Link 
                        to="/listings" 
                        className={`${styles.dropdown} ${isActive(['/listings']) ? styles.active : ''} ${theme === 'dark' ? styles.dark : ''}`}
                    >
                        База квартир
                    </Link>
                    {/* <AdvanceButton /> */}
                    <Link 
                        to="/profile"
                        onClick={handleProfileClick}
                        data-profile="true"
                        className={`${isActive(['/profile']) ? styles.active : ''} ${theme === 'dark' ? styles.dark : ''}`}
                    >
                        Профиль
                    </Link>
                </nav>
                )}
                
                {/* Десктопные кнопки */}
                {!isMobile && (
                    <>
                        <Link to="/about" className={styles.contactBtn}>Связаться с нами</Link>
                        <button
                            className={styles.themeToggle}
                            onClick={toggleTheme}
                            aria-label={theme === 'light' ? 'Переключить на тёмную тему' : 'Переключить на светлую тему'}
                        >
                            <img
                                src={theme === 'light' ? '/icons/Home/sun-icon.png' : '/icons/Home/moon-icon.png'}
                                alt={theme === 'light' ? 'Солнце' : 'Луна'}
                                width={theme === 'light' ? '44' : '39'}
                                height={theme === 'light' ? '44' : '39'}
                                className={styles.themeIcon}
                            />
                        </button>
                    </>
                )}

                {/* Бургер-кнопка - только на мобильных */}
                {isMobile && (
                    <button 
                        className={`${styles.burger} ${menuOpen ? styles.open : ''}`} 
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Открыть меню"
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                )}
            </header>

            {/* Мобильное боковое меню */}
            <AnimatePresence>
                {isMobile && menuOpen && (
                    <>
                        {/* Оверлей */}
                        <motion.div
                            className={styles.overlay}
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            exit={{opacity: 0}}
                            transition={{duration: 0.3}}
                            onClick={handleOverlayClick}
                        />
                        
                        {/* Боковое меню */}
                        <motion.div
                            className={`${styles.navMenu} ${theme === 'dark' ? styles.dark : ''}`}
                            initial={{x: '-100%'}}
                            animate={{x: 0}}
                            exit={{x: '-100%'}}
                            transition={{duration: 0.3, ease: "easeOut"}}
                        >
                            <div className={styles.mobileMenuHeader}>
                                <h3>Меню</h3>
                            </div>
                            
                            <nav className={styles.mobileNavMenu}>
                                <Link 
                                    to="/home2" 
                                    className={`${isActive(['/home2']) ? styles.active : ''} ${theme === 'dark' ? styles.dark : ''}`}
                                    onClick={handleNavClick}
                                >
                                    Главная
                                </Link>
                                <Link 
                                    to="/about" 
                                    className={`${isActive(['/about']) ? styles.active : ''} ${theme === 'dark' ? styles.dark : ''}`}
                                    onClick={handleNavClick}
                                >
                                    О нас
                                </Link>
                                <Link 
                                    to="/listings" 
                                    className={`${styles.dropdown} ${isActive(['/listings']) ? styles.active : ''} ${theme === 'dark' ? styles.dark : ''}`}
                                    onClick={handleNavClick}
                                >
                                    База квартир
                                </Link>

                                <Link 
                                    to="/profile"
                                    onClick={(e) => {
                                        handleProfileClick(e);
                                        handleNavClick();
                                    }}
                                    data-profile="true"
                                    className={`${isActive(['/profile']) ? styles.active : ''} ${theme === 'dark' ? styles.dark : ''}`}
                                >
                                    Профиль
                                </Link>
                            </nav>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Модальное окно авторизации */}
            {showAuthModal && (
                <AuthModal 
                    onClose={() => setShowAuthModal(false)}
                    onAuthSuccess={() => {
                        setShowAuthModal(false);
                        window.location.reload(); // Перезагружаем страницу для обновления состояния
                    }}
                />
            )}
        </>
    );
};

export default Home2Header;
