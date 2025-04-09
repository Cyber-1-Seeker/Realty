import React from 'react'
import styles from './Testimonials.module.css'
import {motion} from "framer-motion";

const Testimonials = () => {
  return (
      <motion.section
          className={styles.testimonials}
          initial={{opacity: 0, y: 50}}
          whileInView={{opacity: 1, y: 0}}
          transition={{duration: 0.6}}
          viewport={{once: true, amount: 0.2}}
      >
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
      </motion.section>
  )
}

export default Testimonials
