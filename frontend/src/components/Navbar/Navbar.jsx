import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import classes from './Navbar.module.css'

const Navbar = () => {
  const [showNavbar, setShowNavbar] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      setShowNavbar(scrollTop > window.innerHeight * 0.85) // чуть ниже Hero
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`${classes.navbar} ${showNavbar ? classes.show : ''}`}>
      <div className={classes.logo}>🏠 Realty</div>
      <ul className={classes.navLinks}>
        <li><Link to="/">Главная</Link></li>
        <li><Link to="/calculator">Калькулятор</Link></li>
        <li><Link to="/about">О нас</Link></li>
        <li><Link to="/services">Услуги</Link></li>
        <li><Link to="#">Контакты</Link></li>
      </ul>
    </nav>
  )
}

export default Navbar
