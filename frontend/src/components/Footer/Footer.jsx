import React from 'react'
import classes from './Footer.module.css'

const Footer = () => {
  return (
    <footer className={classes.footer}>
      <div className={classes.content}>
        <p>&copy; {new Date().getFullYear()} Realty. Все права защищены.</p>
        <p><a href="#">Политика конфиденциальности</a></p>
      </div>
    </footer>
  )
}

export default Footer
