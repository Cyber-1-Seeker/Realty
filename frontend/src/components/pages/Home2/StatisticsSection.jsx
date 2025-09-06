// StatisticsSection.jsx
import React from 'react';
import styles from './StatisticsSection.module.css';
import CountUp from 'react-countup';
import { useNavigate } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';

const stats = [
  { icon: '🏆', number: 4586, label: 'Получено наград' },
  { icon: '📄', number: 789, label: 'Новых объявлений в неделю' },
  { icon: '👨‍💼', number: 483, label: 'Активных агентов' },
  { icon: '💚', number: 1576, label: 'Довольных клиентов' }
];

const StatisticsSection = ({ theme }) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });
  const navigate = useNavigate();

  const handleAboutClick = () => {
    // Сначала устанавливаем флаг для сброса прокрутки при возврате
    sessionStorage.setItem('shouldResetScroll', 'true');
    // Затем очищаем сохраненную позицию прокрутки
    sessionStorage.removeItem('scrollPosition');
    sessionStorage.removeItem('isNavigationReload');
    
    navigate('/about');
    // Прокручиваем к началу страницы после перехода
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  return (
    <section className={styles.section + (theme === 'dark' ? ' ' + styles.dark : '')} ref={ref}>
      <div className={styles.decorLeft} />
      <div className={styles.decorRight} />
      <div className={styles.contentWrapper}>
        <div className={styles.textBlock}>
          <span className={styles.subtitle}>Наш опыт</span>
          <h2 className={styles.title}>Что мы уже сделали</h2>
          <p className={styles.text}>
            Мы гордимся тем, что достигаем высоких результатов. Каждое наше достижение — это вклад в ваш комфорт.
          </p>
          <p className={styles.text}>
            Над проектами трудятся профессиональные команды, и цифры говорят сами за себя.
          </p>
          <button onClick={handleAboutClick} className={styles.button}>Подробнее</button>
        </div>

        <div className={styles.card}>
          {stats.map((stat, index) => (
            <div key={index} className={styles.statBlock}>
              <div className={styles.icon}>{stat.icon}</div>
              <div className={styles.number}>
                {inView ? <CountUp end={stat.number} duration={2} /> : '0'}
              </div>
              <div className={styles.label}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatisticsSection;