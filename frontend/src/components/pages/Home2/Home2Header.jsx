import React, { useState } from 'react';
import { useTheme } from '@/context/ThemeContext.jsx';
import AdvanceModal from "./AdvanceModal.jsx";
import styles from './Home2Header.module.css';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import useAuthGuard from '@/hooks/useAuthGuard';
import AuthModal from '@/components/AuthModal/AuthModal.jsx';

const Home2Header = ({ isAuthenticated = false }) => {
    const { theme, toggleTheme } = useTheme();
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const [showAuthModal, setShowAuthModal] = useState(false);
    
    const isActive = (paths) => paths.some(p => pathname === p || pathname.startsWith(p + '/'));

    const guard = useAuthGuard(isAuthenticated, () => setShowAuthModal(true));

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
            <header className={`${styles.home2Header} ${theme === 'dark' ? styles.dark : ''}`}>
                <div className={styles.logo}><span>STRACK </span><b>ESTATE</b></div>
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
                    <AdvanceModal theme={theme}/>
                    <a 
                        href="#"
                        onClick={handleProfileClick}
                        className={`${isActive(['/profile']) ? styles.active : ''} ${theme === 'dark' ? styles.dark : ''}`}
                    >
                        Профиль
                    </a>
                </nav>
                <button className={styles.contactBtn}>Связаться с нами</button>
                <button
                    className={styles.themeToggle}
                    onClick={toggleTheme}
                    aria-label={theme === 'light' ? 'Переключить на тёмную тему' : 'Переключить на светлую тему'}
                >
                    <img
                        src={theme === 'light' ? '/icons/Home/sun-icon.png' : '/icons/Home/moon-icon.png'}
                        alt={theme === 'light' ? 'Луна' : 'Солнце'}
                        width={theme === 'light' ? '44' : '39'}
                        height={theme === 'light' ? '44' : '39'}
                        className={styles.themeIcon}
                    />
                </button>
            </header>

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
