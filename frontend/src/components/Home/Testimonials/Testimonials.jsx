import React from 'react'
import styles from './Testimonials.module.css'

const Testimonials = () => {
  return (
    <section className={styles.testimonials}>
      <h2>Отзывы клиентов</h2>
      <div className={styles.list}>
        <div className={styles.item}>
          <p>“Продали квартиру за 2 дня, всё прошло спокойно и безопасно. Очень доволен!”</p>
          <strong>— Иван, Москва</strong>
        </div>
        <div className={styles.item}>
          <p>“Получил аванс в день обращения. Полностью довольна сотрудничеством.”</p>
          <strong>— Мария, Химки</strong>
        </div>
        <div className={styles.item}>
          <p>“Не думал, что можно продать квартиру так быстро. Спасибо за помощь!”</p>
          <strong>— Алексей, Балашиха</strong>
        </div>
      </div>
    </section>
  )
}

export default Testimonials
