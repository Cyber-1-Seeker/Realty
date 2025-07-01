import React from 'react'
import { Link } from 'react-router-dom'
import classes from './Footer.module.css'

const Footer = () => {
  return (
    <footer className={classes.footer}>
      <div className={classes.content}>
        <p>&copy; {new Date().getFullYear()} Realty. Все права защищены.</p>
        <p><Link to="/privacy">Политика конфиденциальности</Link></p>
      </div>
    </footer>
  )
}

export default Footer
