import React from 'react'
import styles from './CallToAction.module.css'
import { Link } from 'react-router-dom'

const CallToAction = () => {
  return (
    <section className={styles.cta}>
      <h2>Хотите узнать стоимость вашей квартиры?</h2>
      <p>Заполните форму — мы перезвоним в течение 15 минут.</p>
      <Link to="/calculator" className={styles.button}>Перейти к калькулятору</Link>
    </section>
  )
}

export default CallToAction
