import React from 'react';
import { Link } from 'react-router-dom';
import styles from './ListingsHero.module.css';

const ListingsHero = ({ title, subtitle, backgroundImage, onAddClick, onUrgentClick }) => {
  return (
    <div
      className={styles.hero}
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className={styles.overlay}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.subtitle}>{subtitle}</p>

        <div className={styles.buttons}>
          <button className={styles.mainButton} onClick={onAddClick}>
            Разместить квартиру
          </button>
          <div className={styles.smallButtons}>
            <Link to="/" className={`${styles.smallButton} ${styles.primarySmall}`}>
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
