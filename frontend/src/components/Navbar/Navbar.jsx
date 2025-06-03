import React, {useState, useEffect, useRef} from 'react'
import {Link, useNavigate, useLocation} from 'react-router-dom'
import classes from './Navbar.module.css'
import {motion, AnimatePresence} from 'framer-motion'
import {FaTelegramPlane, FaWhatsapp, FaUserCircle} from 'react-icons/fa'
import AuthModal from '../AuthModal/AuthModal'
import useAuthGuard from '@/hooks/useAuthGuard'

const Navbar = ({isAuthenticated, user}) => {
    const [menuOpen, setMenuOpen] = useState(false)
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
    const [showNavbar, setShowNavbar] = useState(window.innerWidth <= 768)
    const [showAuthModal, setShowAuthModal] = useState(false)
    const navigate = useNavigate()
    const location = useLocation() // Добавлено: получение текущего местоположения
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

        // Если мы на главной странице
        if (location.pathname === '/') {
            // Прокручиваем к калькулятору
            const calculatorElement = document.getElementById('calculator');
            if (calculatorElement) {
                calculatorElement.scrollIntoView({behavior: 'smooth'});
            }
        } else {
            // Переходим на главную страницу с якорем калькулятора
            navigate('/#calculator');
        }
    };

    const handleContactsClick = () => {
        setMenuOpen(false);

        // Если мы на главной странице
        if (location.pathname === '/') {
            // Прокручиваем к контактам
            const contactsElement = document.getElementById('contacts');
            if (contactsElement) {
                contactsElement.scrollIntoView({behavior: 'smooth'});
            }
        } else {
            // Переходим на главную страницу с якорем калькулятора
            navigate('/#contacts');
        }
    };

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth <= 768
            setIsMobile(mobile)
            setMenuOpen(false)
            if (!mobile) setShowNavbar(false)
            else setShowNavbar(true)
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
                className={`${classes.navbar} ${!isMobile && !showNavbar ? classes.hidden : classes.visible}`}
                ref={navbarRef}
            >
                <div className={classes.logo}><Link to="/" onClick={() => setMenuOpen(false)}>
                    <a>🏠 Realty </a>
                </Link></div>

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

                {isMobile && (
                    <button className={classes.burger} onClick={() => setMenuOpen(!menuOpen)}>
                        ☰
                    </button>
                )}

                <AnimatePresence>
                    {(menuOpen || !isMobile) && (
                        <motion.ul
                            className={`${classes.navLinks} ${isMobile && menuOpen ? classes.open : ''}`}
                            initial={{opacity: 0, y: -10}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, y: -10}}
                            transition={{duration: 0.3, ease: "easeInOut"}}
                        >
                            {isMobile && (
                                <li className={classes.profileMobile} onClick={handleProfileClick}>
                                    <FaUserCircle className={classes.icon} size={24}/>
                                </li>
                            )}

                            <li><Link to="/" onClick={() => setMenuOpen(false)}>Главная</Link></li>

                            {/* Исправленная кнопка калькулятора */}
                            <li>
                                <a
                                    href="/#calculator"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleCalculatorClick();
                                    }}
                                >
                                    Калькулятор
                                </a>
                            </li>

                            <li><Link to="/about" onClick={() => setMenuOpen(false)}>О нас</Link></li>
                            <li><Link to="/listings" onClick={() => setMenuOpen(false)}>База квартир</Link></li>
                            <li>
                                <a
                                    href="#contacts"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleContactsClick();
                                    }}
                                >
                                    Контакты
                                </a>
                            </li>

                            {!isMobile && (
                                <li className={classes.profileDesktop} onClick={handleProfileClick}>
                                    <FaUserCircle className={classes.icon} size={24}/>
                                </li>
                            )}

                            {isMobile && (
                                <>
                                    <li><a href="tel:+79999999999">+7 (999) 999 99-99</a></li>
                                    <li><a href="mailto:info@realty.ru">info@realty.ru</a></li>
                                    <li className={classes.iconsMobile}>
                                        <a href="#"><FaTelegramPlane className={classes.icon}/></a>
                                        <a href="#"><FaWhatsapp className={classes.icon}/></a>
                                    </li>
                                </>
                            )}
                        </motion.ul>
                    )}
                </AnimatePresence>
            </nav>

            {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)}/>}
        </>
    )
}

export default Navbar