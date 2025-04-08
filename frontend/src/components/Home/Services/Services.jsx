import React from 'react'
import styles from './Services.module.css'

const Services = () => {
  return (
    <section className={styles.services}>
      <h2>Наши услуги</h2>
      <div className={styles.list}>
        <div className={styles.card}>
          <h3>📍 Срочный выкуп квартир</h3>
          <p>Покупаем квартиры за 1–2 дня с авансом сразу после подписания договора.</p>
        </div>
        <div className={styles.card}>
          <h3>🔁 Альтернатива</h3>
          <p>Помогаем обменять старую квартиру на новую с доплатой или без.</p>
        </div>
        <div className={styles.card}>
          <h3>📜 Юридическое сопровождение</h3>
          <p>Проверим документы, поможем с оформлением, решим сложные ситуации.</p>
        </div>
        <div className={styles.card}>
          <h3>🏘️ Выкуп комнат и долей</h3>
          <p>Покупаем доли, комнаты и долевую собственность по выгодным условиям.</p>
        </div>
      </div>
    </section>
  )
}

export default Services
