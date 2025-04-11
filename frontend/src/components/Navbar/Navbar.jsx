import React, {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import classes from './Navbar.module.css'
import {motion, AnimatePresence} from 'framer-motion'

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false)
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
    const [showNavbar, setShowNavbar] = useState(window.innerWidth <= 768)
    const [lastScrollY, setLastScrollY] = useState(0)

    // Определяем мобильный режим
    useEffect(() => {
        if (!isMobile) {
            setShowNavbar(false) // скрыть при старте
            const handleScroll = () => {
                const currentScrollY = window.scrollY
                setShowNavbar(currentScrollY > window.innerHeight - 100)
            }
            window.addEventListener('scroll', handleScroll)
            return () => window.removeEventListener('scroll', handleScroll)
        } else {
            setShowNavbar(true)
        }
    }, [isMobile])


    return (
        <nav className={`${classes.navbar} ${!isMobile && !showNavbar ? classes.hidden : classes.visible}`}>
            <div className={classes.logo}>🏠 Realty</div>

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
                        transition={{duration: 0.2}}
                    >
                        <li><Link to="/" onClick={() => setMenuOpen(false)}>Главная</Link></li>
                        <li><Link to="/calculator" onClick={() => setMenuOpen(false)}>Калькулятор</Link></li>
                        <li><Link to="/about" onClick={() => setMenuOpen(false)}>О нас</Link></li>
                        <li><Link to="#">База квартир</Link></li>
                        <li><Link to="#">Контакты</Link></li>
                    </motion.ul>
                )}
            </AnimatePresence>
        </nav>
    )
}

export default Navbar
