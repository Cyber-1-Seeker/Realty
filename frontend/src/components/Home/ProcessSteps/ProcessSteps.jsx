import React from 'react'
import styles from './ProcessSteps.module.css'

const ProcessSteps = () => {
  return (
    <section className={styles.process}>
      <h2>Как проходит выкуп</h2>
      <div className={styles.steps}>
        <div className={styles.step}>
          <h3>📞 1. Заявка</h3>
          <p>Оставьте заявку или позвоните — мы свяжемся с вами в течение 15 минут.</p>
        </div>
        <div className={styles.step}>
          <h3>🏠 2. Оценка</h3>
          <p>Оценим квартиру по рыночной стоимости в день обращения.</p>
        </div>
        <div className={styles.step}>
          <h3>✍️ 3. Договор</h3>
          <p>Согласуем условия и оформим договор выкупа.</p>
        </div>
        <div className={styles.step}>
          <h3>💰 4. Аванс и оплата</h3>
          <p>Вы получаете аванс сразу после подписания и полную оплату при расчёте.</p>
        </div>
      </div>
    </section>
  )
}

export default ProcessSteps
