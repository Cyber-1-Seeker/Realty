import React from 'react';
import CalculatorForm from './CalculatorForm.jsx';
import styles from './CalculatorLaunch.module.css';

const CalculatorLaunch = ({ theme }) => {
  return (
    <section className={styles.section + (theme === 'dark' ? ' ' + styles.dark : '')}>
      <div className={styles.wrapper}>
        <div className={styles.contentCenter}>
          {/* Красивая иконка калькулятора */}
          <div className={styles.calculatorIcon}>
            <svg className={styles.calculatorSvg} viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg">
              {/* Основа калькулятора */}
              <rect x="20" y="20" width="160" height="200" rx="20" fill="#2c63ff" stroke="#1a2b5a" strokeWidth="2"/>
              
              {/* Экран */}
              <rect x="35" y="35" width="130" height="40" rx="8" fill="#ffffff" stroke="#dce4ef" strokeWidth="1"/>
              <text x="155" y="60" textAnchor="end" fill="#2c63ff" fontSize="20" fontWeight="bold">₽</text>
              
              {/* Кнопки - первый ряд */}
              <circle cx="55" cy="100" r="12" fill="#f8f9fa" stroke="#2c63ff" strokeWidth="2"/>
              <circle cx="85" cy="100" r="12" fill="#f8f9fa" stroke="#2c63ff" strokeWidth="2"/>
              <circle cx="115" cy="100" r="12" fill="#f8f9fa" stroke="#2c63ff" strokeWidth="2"/>
              <circle cx="145" cy="100" r="12" fill="#ffed66" stroke="#cc9900" strokeWidth="2"/>
              
              {/* Кнопки - второй ряд */}
              <circle cx="55" cy="130" r="12" fill="#f8f9fa" stroke="#2c63ff" strokeWidth="2"/>
              <circle cx="85" cy="130" r="12" fill="#f8f9fa" stroke="#2c63ff" strokeWidth="2"/>
              <circle cx="115" cy="130" r="12" fill="#f8f9fa" stroke="#2c63ff" strokeWidth="2"/>
              <circle cx="145" cy="130" r="12" fill="#f8f9fa" stroke="#2c63ff" strokeWidth="2"/>
              
              {/* Кнопки - третий ряд */}
              <circle cx="55" cy="160" r="12" fill="#f8f9fa" stroke="#2c63ff" strokeWidth="2"/>
              <circle cx="85" cy="160" r="12" fill="#f8f9fa" stroke="#2c63ff" strokeWidth="2"/>
              <circle cx="115" cy="160" r="12" fill="#f8f9fa" stroke="#2c63ff" strokeWidth="2"/>
              <circle cx="145" cy="160" r="12" fill="#f8f9fa" stroke="#2c63ff" strokeWidth="2"/>
              
              {/* Большая кнопка равно */}
              <rect x="130" y="175" width="30" height="25" rx="12" fill="#ffcc00" stroke="#cc9900" strokeWidth="2"/>
              <text x="145" y="192" textAnchor="middle" fill="#1a2b5a" fontSize="16" fontWeight="bold">=</text>
              
              {/* Нижние кнопки */}
              <circle cx="55" cy="190" r="12" fill="#f8f9fa" stroke="#2c63ff" strokeWidth="2"/>
              <circle cx="85" cy="190" r="12" fill="#f8f9fa" stroke="#2c63ff" strokeWidth="2"/>
              <circle cx="115" cy="190" r="12" fill="#f8f9fa" stroke="#2c63ff" strokeWidth="2"/>
            </svg>
          </div>
          
          <h2 className={styles.heading}>
            Калькулятор стоимости квартиры
          </h2>
          <p className={styles.subtext}>
            Узнайте рыночную стоимость вашей недвижимости в Москве с точностью до 96%
          </p>
          
          <CalculatorForm theme={theme} />
        </div>
      </div>
    </section>
  );
};

export default CalculatorLaunch;