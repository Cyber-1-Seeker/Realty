import React from 'react';
import styles from './AboutUsSection.module.css';
import { FaCheckCircle } from 'react-icons/fa';
import aboutImage from '@/assets/Listings/about-livingroom.png';

const features = [
  {
    title: 'Понимание рынка',
    description: 'Мы точно знаем, что ценно для покупателей и продавцов сегодня.',
  },
  {
    title: 'Персональный подход',
    description: 'Каждому клиенту — индивидуальный план и честная стратегия.',
  },
  {
    title: 'Результат без стресса',
    description: 'Оформим, сопроводим, доведём до сделки — без лишней головной боли.',
  },
];

const facts = [
  { value: '10+', label: 'лет на рынке' },
  { value: '500+', label: 'довольных клиентов' },
  { value: '100%', label: 'юридическая чистота' },
];

const AboutUsSection = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.imageBox}>
          <img src={aboutImage} alt="Интерьер уютной гостиной" />
        </div>
        <div className={styles.textBox}>
          <div className={styles.subheading}>О компании</div>
          <h2 className={styles.heading}>
            Мы не просто продаём дома — мы решаем вопросы недвижимости так, как удобно вам
          </h2>
          {features.map((item, idx) => (
            <div className={styles.item} key={idx}>
              <FaCheckCircle className={styles.icon} />
              <div className={styles.itemText}>
                <h4>{item.title}</h4>
                <p>{item.description}</p>
              </div>
            </div>
          ))}
          <button className={styles.button}>Узнать больше</button>
        </div>
      </div>
    </section>
  );
};

export default AboutUsSection;