import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import styles from './About.module.css';

const About = () => {
  const { theme } = useTheme();
  
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
