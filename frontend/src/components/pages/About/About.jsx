import React, { useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import styles from './About.module.css';

const About = () => {
  const { theme } = useTheme();
  
  // Устанавливаем флаг сброса прокрутки сразу при создании компонента
  console.log('About: Устанавливаем флаг shouldResetScroll');
  sessionStorage.setItem('shouldResetScroll', 'true');

  // Очищаем сохраненную позицию прокрутки и прокручиваем к началу
  useEffect(() => {
    // Сначала устанавливаем флаг для сброса прокрутки в хуке
    sessionStorage.setItem('shouldResetScroll', 'true');
    // Затем очищаем остальные флаги
    sessionStorage.removeItem('scrollPosition');
    sessionStorage.removeItem('isNavigationReload');
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={`${styles.pageWrapper} ${theme === 'dark' ? styles.dark : ''}`}>

      <div className={styles.content}>
        <h2>О нас</h2>
        <p>Информация о компании...</p>
      </div>
    </div>
  );
};

export default About;
