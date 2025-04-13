import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import classes from './Navbar.module.css'
import { motion, AnimatePresence } from 'framer-motion'
import { FaTelegramPlane, FaWhatsapp } from 'react-icons/fa'

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  const [showNavbar, setShowNavbar] = useState(window.innerWidth <= 768)

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
        setShowNavbar(window.scrollY > window.innerHeight - 100)
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

      {!isMobile && (
        <div className={classes.contacts}>
          <a href="tel:+79999999999">+7 (999) 999 99-99</a>
          <a href="mailto:info@realty.ru">info@realty.ru</a>
          <a href="#"><FaTelegramPlane className={classes.icon} /></a>
          <a href="#"><FaWhatsapp className={classes.icon} /></a>
        </div>
      )}

      {isMobile && (
        <button className={classes.burger} onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>
      )}

      <AnimatePresence>
        {(menuOpen || !isMobile) && (
          <motion.ul
            className={`${classes.navLinks} ${isMobile && menuOpen ? classes.open : ''}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <li><Link to="/" onClick={() => setMenuOpen(false)}>Главная</Link></li>
            <li><a href="#calculator" onClick={() => setMenuOpen(false)}>Калькулятор</a></li>
            <li><Link to="/about" onClick={() => setMenuOpen(false)}>О нас</Link></li>
            <li><Link to="#">База квартир</Link></li>
            <li><a href="#contacts">Контакты</a></li>

            {isMobile && (
              <>
                <li><a href="tel:+79999999999">+7 (999) 999 99-99</a></li>
                <li><a href="mailto:info@realty.ru">info@realty.ru</a></li>
                <li className={classes.iconsMobile}>
                  <a href="#"><FaTelegramPlane className={classes.icon} /></a>
                  <a href="#"><FaWhatsapp className={classes.icon} /></a>
                </li>
              </>
            )}
          </motion.ul>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navbar
