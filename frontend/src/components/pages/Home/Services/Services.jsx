import React from 'react';
import styles from './Services.module.css';
import { motion } from 'framer-motion';

const services = [
  {
    img: '/icons/Home/services.svg',
    title: 'Срочный выкуп',
    description: 'Покупаем квартиру за 1 день. Аванс сразу.'
  },
  {
    img: '/icons/Home/services2.svg',
    title: 'Альтернатива',
    description: 'Обмен квартиры с доплатой или без.'
  },
  {
    img: '/icons/Home/services3.svg',
    title: 'Юрист бесплатно',
    description: 'Проверим документы и решим любые вопросы.'
  },
  {
    img: '/icons/Home/services4.svg',
    title: 'Выкуп долей',
    description: 'Покупаем комнаты и доли по рыночной цене.'
  }
];

const Services = () => {
  return (
    <motion.section
      className={styles.servicesWrapper}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className={styles.servicesBox}>
        <h2>Наши услуги</h2>
        <div className={styles.cards}>
          {services.map((s, i) => (
            <div key={i} className={styles.card}>
              <img src={s.img} alt={s.title} className={styles.icon}/>
              <h3>{s.title}</h3>
              <p>{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default Services;
