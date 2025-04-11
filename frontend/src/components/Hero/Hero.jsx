import React from 'react'
import classes from './Hero.module.css'
import { Link } from 'react-router-dom'

const Hero = () => {
  return (
      <section className={classes.heroSection}>
        <div className={classes.heroOverlay}></div>

        <nav className={classes.heroNav}>
          <Link to="#">Получить аванс</Link>
            <a href="#calculator">Калькулятор стоимости</a>
          <Link to="#">Купить</Link>
          <Link to="#">База квартир</Link>
          <Link to="/about">О нас</Link>
        </nav>

        <div className={classes.heroContent}>
          <div className={classes.heroText}>
            <h1>Срочный выкуп квартир в Москве и Московской области</h1>
            <p>до 100% от рыночной стоимости</p>
            <p>Аванс сразу после подписания договора</p>
          </div>
          <div className={classes.heroForm}>
            <div className={classes.heroFormTitle}>Получите консультацию</div>
            <div className={classes.heroFormBody}>
              <input type="text" placeholder="Введите имя"/>
              <input type="tel" placeholder="Введите телефон"/>
              <button>Оставить заявку</button>
            </div>
            <div className={classes.heroFormNote}>
              Нажимая на кнопку, вы соглашаетесь с <a href="#">политикой конфиденциальности сайта</a>
            </div>
          </div>
        </div>
      </section>
  )
}

export default Hero
