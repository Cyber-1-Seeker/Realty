import React from 'react';
import {useTheme} from '@/context/ThemeContext.jsx';
import AdvanceModal from "@/components/pages/Home2/AdvanceModal.jsx";
import styles from './Header.module.css';

const Header = ({ activePage = 'home' }) => {
    const {theme, toggleTheme} = useTheme();

    return (
        <header className={styles.header}>
            <div className={styles.logo}><span>STRACK </span><b>ESTATE</b></div>
            <nav className={styles.navMenu}>
                <a 
                    href="/" 
                    className={activePage === 'home' ? styles.active : ''}
                >
                    Главная
                </a>
                <a 
                    href="/about" 
                    className={activePage === 'about' ? styles.active : ''}
                >
                    О нас
                </a>
                <a 
                    href="/listings" 
                    className={`${styles.dropdown} ${activePage === 'listings' ? styles.active : ''}`}
                >
                    База квартир
                </a>
                <AdvanceModal theme={theme}/>
                <a 
                    href="/profile" 
                    className={activePage === 'profile' ? styles.active : ''}
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
    );
};

export default Header; 