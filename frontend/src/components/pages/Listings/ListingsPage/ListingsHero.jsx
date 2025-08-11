import React from 'react';
import { Link } from 'react-router-dom';
import styles from './ListingsHero.module.css';
import { useTheme } from '@/context/ThemeContext';

const ListingsHero = ({ title, subtitle, backgroundImage, onAddClick, onUrgentClick }) => {
  const { theme } = useTheme();
  
  return (
    <div
      className={`${styles.hero} ${theme === 'dark' ? styles.dark : ''}`}
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className={`${styles.overlay} ${theme === 'dark' ? styles.darkOverlay : ''}`}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.subtitle}>{subtitle}</p>

        <div className={styles.buttons}>
          <button className={styles.mainButton} onClick={onAddClick}>
            Разместить квартиру
          </button>
          <div className={styles.smallButtons}>
            <Link to="/home2" className={`${styles.smallButton} ${styles.primarySmall}`}>
              Главная
            </Link>
            <button className={`${styles.smallButton} ${styles.urgentSmall}`} onClick={onUrgentClick}>
              Срочно продать
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingsHero;
