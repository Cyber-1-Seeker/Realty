import React from 'react'
import styles from './WhyUs.module.css'

const WhyUs = () => {
  return (
    <section className={styles.whyUs}>
      <h2>Почему выбирают нас</h2>
      <div className={styles.reasons}>
        <div className={styles.reason}>
          <h3>💸 До 100% рыночной стоимости</h3>
          <p>Мы предлагаем лучшие условия на рынке выкупа.</p>
        </div>
        <div className={styles.reason}>
          <h3>⚡ Срочный выкуп за 1 день</h3>
          <p>Оценка и оформление сделки в кратчайшие сроки.</p>
        </div>
        <div className={styles.reason}>
          <h3>📝 Юридическая поддержка</h3>
          <p>Полное сопровождение на всех этапах.</p>
        </div>
      </div>
    </section>
  )
}

export default WhyUs
