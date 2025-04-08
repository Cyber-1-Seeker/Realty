import React from 'react'
import { Link } from 'react-router-dom'
import classes from './Navbar.module.css'

const Navbar = () => {
  return (
    <nav className={classes.navbar}>
      <div className={classes.logo}>🏠 Realty</div>
      <ul className={classes.navLinks}>
        <li><Link to="/">Главная</Link></li>
        <li><Link to="/calculator">Калькулятор</Link></li>
        <li><Link to="/about">О нас</Link></li>
        <li><Link to="#">База квартир</Link></li>
        <li><Link to="#">Контакты</Link></li>
      </ul>
    </nav>
  )
}

export default Navbar
