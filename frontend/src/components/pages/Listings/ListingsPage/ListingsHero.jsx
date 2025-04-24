import React from 'react';
import styles from './ListingsHero.module.css';

const ListingsHero = ({ title, subtitle, backgroundImage }) => {
  return (
    <div
      className={styles.hero}
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className={styles.overlay}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.subtitle}>{subtitle}</p>
      </div>
    </div>
  );
};

export default ListingsHero;
