import React, {useState, useEffect, useRef} from 'react'
import {Link, useNavigate, useLocation} from 'react-router-dom'
import classes from './Navbar.module.css'
import {motion, AnimatePresence} from 'framer-motion'
import {FaTelegramPlane, FaWhatsapp, FaUserCircle} from 'react-icons/fa'
import {useTheme} from '@/context/ThemeContext'
import AuthModal from '../AuthModal/AuthModal'
import useAuthGuard from '@/hooks/useAuthGuard'

const Navbar = ({isAuthenticated, user}) => {
    const [menuOpen, setMenuOpen] = useState(false)
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
    const [showNavbar, setShowNavbar] = useState(window.innerWidth <= 768)
    const [showAuthModal, setShowAuthModal] = useState(false)
    const {theme, toggleTheme} = useTheme()
    const navigate = useNavigate()
    const location = useLocation()
    const hideTimeoutRef = useRef(null)
    const navbarRef = useRef(null)
    const [scrolledDown, setScrolledDown] = useState(false)

    const guard = useAuthGuard(isAuthenticated, () => setShowAuthModal(true))

    const handleProfileClick = guard(() => {
        navigate('/profile')
    })

    // Функция для обработки клика на "Калькулятор"
    const handleCalculatorClick = () => {
        setMenuOpen(false);

        if (location.pathname === '/') {
            const calculatorElement = document.getElementById('calculator');
            if (calculatorElement) {
                calculatorElement.scrollIntoView({behavior: 'smooth'});
            }
        } else {
            navigate('/#calculator');
        }
    };

    const handleContactsClick = () => {
        setMenuOpen(false);

        if (location.pathname === '/') {
            const contactsElement = document.getElementById('contacts');
            if (contactsElement) {
                contactsElement.scrollIntoView({behavior: 'smooth'});
            }
        } else {
            navigate('/#contacts');
        }
    };

    // Закрытие меню при клике на оверлей
    const handleOverlayClick = () => {
        setMenuOpen(false)
    }

    // Закрытие меню при нажатии Escape
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                setMenuOpen(false)
            }
        }

        if (menuOpen) {
            document.addEventListener('keydown', handleEscape)
            // Блокируем скролл body при открытом меню
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }

        return () => {
            document.removeEventListener('keydown', handleEscape)
            document.body.style.overflow = 'unset'
        }
    }, [menuOpen])

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth <= 768
            setIsMobile(mobile)
            setMenuOpen(false)
            // Всегда показываем навбар на мобильных устройствах, независимо от страницы
            if (mobile) {
                setShowNavbar(true)
            } else {
                setShowNavbar(false)
            }
        }

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    useEffect(() => {
        if (!isMobile) {
            const handleScroll = () => {
                const shouldShowNavbar = window.scrollY > window.innerHeight - 100
                setShowNavbar(shouldShowNavbar)
                setScrolledDown(shouldShowNavbar)
            }

            window.addEventListener('scroll', handleScroll)
            return () => window.removeEventListener('scroll', handleScroll)
        } else {
            // На мобильных устройствах всегда показываем навбар
            setShowNavbar(true)
        }
    }, [isMobile])

    useEffect(() => {
        if (!isMobile) {
            const handleMouseMove = (e) => {
                const y = e.clientY;
                if (y <= 3) {
                    setShowNavbar(true);
                }
            };

            const handleMouseLeave = () => {
                if (!scrolledDown) {
                    hideTimeoutRef.current = setTimeout(() => {
                        setShowNavbar(false);
                    }, 500);
                }
            };

            const handleMouseEnter = () => {
                if (hideTimeoutRef.current) {
                    clearTimeout(hideTimeoutRef.current);
                    hideTimeoutRef.current = null;
                }
            };

            window.addEventListener('mousemove', handleMouseMove);
            const navbarEl = navbarRef.current;

            if (navbarEl) {
                navbarEl.addEventListener('mouseleave', handleMouseLeave);
                navbarEl.addEventListener('mouseenter', handleMouseEnter);
            }

            return () => {
                window.removeEventListener('mousemove', handleMouseMove);
                if (navbarEl) {
                    navbarEl.removeEventListener('mouseleave', handleMouseLeave);
                    navbarEl.removeEventListener('mouseenter', handleMouseEnter);
                }
                clearTimeout(hideTimeoutRef.current);
            };
        }
    }, [isMobile, scrolledDown]);

    return (
        <>
            <nav
                className={`${classes.navbar} ${!isMobile && !showNavbar ? classes.hidden : classes.visible} ${theme === 'dark' ? classes.dark : ''}`}
                ref={navbarRef}
            >
                {/* Кнопка переключения темы - слева на мобильных */}
                {isMobile && (
                    <button 
                        className={classes.mobileThemeToggle} 
                        onClick={toggleTheme}
                        aria-label={theme === 'light' ? 'Переключить на тёмную тему' : 'Переключить на светлую тему'}
                    >
                        <img
                            src={theme === 'light' ? '/icons/Home/moon-icon.png' : '/icons/Home/sun-icon.png'}
                            alt={theme === 'light' ? 'Луна' : 'Солнце'}
                            width="24"
                            height="24"
                        />
                    </button>
                )}

                <div className={classes.logo}>
                    <Link to="/" onClick={() => setMenuOpen(false)}>
                        Realty
                    </Link>
                </div>

                <div className={classes.centerSection}>
                    {!isMobile && (
                        <div className={classes.contacts}>
                            <a href="tel:+79999999999">+7 (999) 999 99-99</a>
                            <a href="mailto:info@realty.ru">info@realty.ru</a>
                            <a href="#"><FaTelegramPlane className={classes.icon}/></a>
                            <a href="#"><FaWhatsapp className={classes.icon}/></a>
                        </div>
                    )}
                </div>

                {/* Бургер-кнопка - справа на мобильных */}
                {isMobile && (
                    <button 
                        className={`${classes.burger} ${menuOpen ? classes.open : ''}`} 
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Открыть меню"
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                )}

                {/* Десктопное меню */}
                {!isMobile && (
                    <motion.ul
                        className={classes.navLinks}
                        initial={{opacity: 0, y: -10}}
                        animate={{opacity: 1, y: 0}}
                        exit={{opacity: 0, y: -10}}
                        transition={{duration: 0.3, ease: "easeInOut"}}
                    >
                        <li><Link to="/">Главная</Link></li>
                        <li>
                            <button
                                className={classes.linkButton}
                                onClick={handleCalculatorClick}
                            >
                                Калькулятор
                            </button>
                        </li>
                        <li><Link to="/about">О нас</Link></li>
                        <li><Link to="/listings">База квартир</Link></li>
                        <li>
                            <button
                                className={classes.linkButton}
                                onClick={handleContactsClick}
                            >
                                Контакты
                            </button>
                        </li>
                        <li className={classes.profileDesktop} onClick={handleProfileClick}>
                            <FaUserCircle className={classes.icon} size={24}/>
                        </li>
                    </motion.ul>
                )}
            </nav>

            {/* Мобильное боковое меню */}
            <AnimatePresence>
                {isMobile && menuOpen && (
                    <>
                        {/* Оверлей */}
                        <motion.div
                            className={classes.overlay}
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            exit={{opacity: 0}}
                            transition={{duration: 0.3}}
                            onClick={handleOverlayClick}
                        />
                        
                        {/* Боковое меню */}
                        <motion.div
                            className={classes.mobileMenu}
                            initial={{x: -280}}
                            animate={{x: 0}}
                            exit={{x: -280}}
                            transition={{duration: 0.3, ease: "easeOut"}}
                        >
                            <div className={classes.mobileMenuHeader}>
                                <h3>Меню</h3>
                            </div>
                            
                            <ul className={classes.mobileNavLinks}>
                                <li className={classes.profileMobile} onClick={handleProfileClick}>
                                    <FaUserCircle className={classes.icon} size={24}/>
                                    <span>Профиль</span>
                                </li>
                                
                                <li><Link to="/" onClick={() => setMenuOpen(false)}>Главная</Link></li>
                                
                                <li>
                                    <button
                                        className={classes.linkButton}
                                        onClick={handleCalculatorClick}
                                    >
                                        Калькулятор
                                    </button>
                                </li>
                                
                                <li><Link to="/about" onClick={() => setMenuOpen(false)}>О нас</Link></li>
                                <li><Link to="/listings" onClick={() => setMenuOpen(false)}>База квартир</Link></li>
                                
                                <li>
                                    <button
                                        className={classes.linkButton}
                                        onClick={handleContactsClick}
                                    >
                                        Контакты
                                    </button>
                                </li>
                                
                                <li className={classes.mobileContacts}>
                                    <a href="tel:+79999999999">+7 (999) 999 99-99</a>
                                    <a href="mailto:info@realty.ru">info@realty.ru</a>
                                </li>
                                
                                <li className={classes.iconsMobile}>
                                    <a href="#"><FaTelegramPlane className={classes.icon}/></a>
                                    <a href="#"><FaWhatsapp className={classes.icon}/></a>
                                </li>
                            </ul>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)}/>}
        </>
    )
}

export default Navbar