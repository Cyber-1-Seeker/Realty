import React from 'react'
import { Link } from 'react-router-dom'
import classes from './Footer.module.css'
import { useTheme } from '@/context/ThemeContext'

const Footer = () => {
  const { theme } = useTheme()
  
  return (
    <footer className={`${classes.footer} ${theme === 'dark' ? classes.dark : ''}`}>
      <div className={classes.content}>
        <p>&copy; {new Date().getFullYear()} Realty. Все права защищены.</p>
        <p><Link to="/privacy">Политика конфиденциальности</Link></p>
      </div>
    </footer>
  )
}

export default Footer
