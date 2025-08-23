import React from 'react';
import {useInView} from 'react-intersection-observer';
import CalculatorForm from './CalculatorForm.jsx';
import styles from './CalculatorLaunch.module.css';

const CalculatorLaunch = ({theme}) => {
    // Хук для анимации при скролле
    const {ref: calculatorRef, inView: calculatorInView} = useInView({
        triggerOnce: true,
        threshold: 0.3
    });



    return (
        <section className={`${styles.section} ${theme === 'dark' ? styles.dark : ''}`}>
            <div className={`${styles.wrapper} ${theme === 'dark' ? styles.dark : ''}`}>
                <div className={`${styles.contentCenter} ${theme === 'dark' ? styles.dark : ''}`}>
                    {/* Заголовок вверху */}
                    <h2 className={`${styles.heading} ${theme === 'dark' ? styles.dark : ''}`}>
                        Калькулятор стоимости квартиры
                    </h2>

                    <div
                        ref={calculatorRef}
                        className={`${styles.statisticsBackground} ${calculatorInView ? styles.animate : ''} ${theme === 'dark' ? styles.dark : ''}`}
                    >
                        {/* Основные линии статистики */}
                        <div className={styles.chartLines}>
                            <svg viewBox="0 0 4200 800" xmlns="http://www.w3.org/2000/svg"
                                 preserveAspectRatio="xMidYMid meet">
                                <defs>
                                    {/* Градиент для заливки */}
                                    <linearGradient id="gradientFill" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.6"/>
                                        <stop offset="30%" stopColor="#8b5cf6" stopOpacity="0.4"/>
                                        <stop offset="60%" stopColor="#ec4899" stopOpacity="0.2"/>
                                        <stop offset="100%" stopColor="transparent"/>
                                    </linearGradient>

                                    {/* Радиальный градиент для дополнительного эффекта */}
                                    <radialGradient id="radialFill" cx="0.5" cy="0.3" r="0.8">
                                        <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.3"/>
                                        <stop offset="100%" stopColor="transparent"/>
                                    </radialGradient>

                                    {/* Градиент линии */}
                                    <linearGradient id="gradientLine" x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="0%" stopColor="#3b82f6"/>
                                        <stop offset="25%" stopColor="#8b5cf6"/>
                                        <stop offset="50%" stopColor="#ec4899"/>
                                        <stop offset="75%" stopColor="#f59e0b"/>
                                        <stop offset="100%" stopColor="#ef4444"/>
                                    </linearGradient>

                                    {/* Специальные градиенты для темной темы - оставляем яркие цвета */}
                                    <linearGradient id="darkGradientFill" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.6"/>
                                        <stop offset="30%" stopColor="#8b5cf6" stopOpacity="0.4"/>
                                        <stop offset="60%" stopColor="#ec4899" stopOpacity="0.2"/>
                                        <stop offset="100%" stopColor="transparent"/>
                                    </linearGradient>

                                    <linearGradient id="darkGradientLine" x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="0%" stopColor="#3b82f6"/>
                                        <stop offset="25%" stopColor="#8b5cf6"/>
                                        <stop offset="50%" stopColor="#ec4899"/>
                                        <stop offset="75%" stopColor="#f59e0b"/>
                                        <stop offset="100%" stopColor="#ef4444"/>
                                    </linearGradient>

                                    <radialGradient id="darkRadialFill" cx="0.5" cy="0.3" r="0.8">
                                        <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.3"/>
                                        <stop offset="100%" stopColor="transparent"/>
                                    </radialGradient>
                                </defs>

                                {(() => {
                                    // Точки, через которые должна пройти линия
                                    const points = [
                                        [200, 400],
                                        [1400, 250],
                                        [2400, 200],
                                        [3200, 300],
                                        [4000, 150]
                                    ];

                                    // Создаем простую полилинию, которая точно проходит через точки
                                    const createPolylinePath = (pts) => {
                                        if (pts.length < 2) return "";
                                        let d = `M${pts[0][0]} ${pts[0][1]}`;
                                        for (let i = 1; i < pts.length; i++) {
                                            d += ` L${pts[i][0]} ${pts[i][1]}`;
                                        }
                                        return d;
                                    };

                                    // Создаем плавную кривую с помощью кривых Безье
                                    const createSmoothPath = (pts) => {
                                        if (pts.length < 2) return "";
                                        
                                        let d = `M${pts[0][0]} ${pts[0][1]}`;
                                        
                                        for (let i = 1; i < pts.length; i++) {
                                            const prev = pts[i - 1];
                                            const curr = pts[i];
                                            const next = pts[i + 1];
                                            
                                            if (next) {
                                                // Вычисляем контрольные точки для плавности
                                                const tension = 0.3;
                                                const cp1x = prev[0] + (curr[0] - prev[0]) * (1 - tension);
                                                const cp1y = prev[1] + (curr[1] - prev[1]) * (1 - tension);
                                                const cp2x = curr[0] - (next[0] - curr[0]) * tension;
                                                const cp2y = curr[1] - (next[1] - curr[1]) * tension;
                                                
                                                d += ` C${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr[0]} ${curr[1]}`;
                                            } else {
                                                // Последняя точка - прямая линия
                                                d += ` L${curr[0]} ${curr[1]}`;
                                            }
                                        }
                                        return d;
                                    };

                                    const linePath = createSmoothPath(points);
                                    const areaPath = linePath + " L4000 800 L200 800 Z";

                                    return (
                                        <>
                                            {/* Подложка-заливка */}
                                            <path 
                                                d={areaPath} 
                                                fill={theme === 'dark' ? "url(#darkGradientFill)" : "url(#gradientFill)"} 
                                                className={styles.areaFill}
                                            />
                                            {/* Дополнительная радиальная заливка для эффекта */}
                                            <path 
                                                d={areaPath} 
                                                fill={theme === 'dark' ? "url(#darkRadialFill)" : "url(#radialFill)"} 
                                                className={styles.areaFill}
                                            />

                                            {/* Основная линия */}
                                            <path
                                                d={linePath}
                                                fill="none"
                                                stroke={theme === 'dark' ? "url(#darkGradientLine)" : "url(#gradientLine)"}
                                                strokeWidth="12"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className={styles.chartLine}
                                            />

                                            {/* Точки */}
                                            {points.map(([x, y], i) => (
                                                <circle
                                                    key={i}
                                                    cx={x}
                                                    cy={y}
                                                    r="15"
                                                    fill={theme === 'dark' ? "white" : "white"}
                                                    stroke={theme === 'dark' ? "#4f46e5" : "#4f46e5"}
                                                    strokeWidth="6"
                                                    className={styles.chartPoint}
                                                />
                                            ))}
                                        </>
                                    );
                                })()}
                            </svg>
                        </div>

                        {/* Дополнительные элементы статистики */}
                        <div className={styles.statisticsElements}>
                            {/* Круговые диаграммы */}
                            <div className={styles.pieChart}>
                                <svg viewBox="0 0 96 96" className={styles.pieSvg}>
                                    <circle cx="48" cy="48" r="42" fill="none"
                                            stroke={theme === 'dark' ? '#2c63ff' : '#2c63ff'}
                                            strokeWidth="5" strokeDasharray="132 132" strokeDashoffset="66"
                                            className={styles.pieSlice}/>
                                    <circle cx="48" cy="48" r="42" fill="none"
                                            stroke={theme === 'dark' ? '#1e40af' : '#1e40af'}
                                            strokeWidth="5" strokeDasharray="132 132" strokeDashoffset="0"/>
                                </svg>
                            </div>

                            {/* Столбцы гистограммы */}
                            <div className={styles.barChart}>
                                <div className={styles.bar}
                                     style={{
                                         height: '60px',
                                         backgroundColor: theme === 'dark' ? '#2c63ff' : '#2c63ff'
                                     }}></div>
                                <div className={styles.bar}
                                     style={{
                                         height: '84px',
                                         backgroundColor: theme === 'dark' ? '#1e40af' : '#1e40af'
                                     }}></div>
                                <div className={styles.bar}
                                     style={{
                                         height: '48px',
                                         backgroundColor: theme === 'dark' ? '#2c63ff' : '#2c63ff'
                                     }}></div>
                                <div className={styles.bar}
                                     style={{
                                         height: '108px',
                                         backgroundColor: theme === 'dark' ? '#1e40af' : '#1e40af'
                                     }}></div>
                            </div>
                        </div>
                    </div>

                    {/* Текст и кнопка внизу */}
                    <p className={`${styles.subtext} ${theme === 'dark' ? styles.dark : ''}`}>
                        Узнайте рыночную стоимость вашей недвижимости в Москве с точностью до 96%
                    </p>

                    <CalculatorForm theme={theme}/>
                </div>
            </div>
        </section>
    );
};

export default CalculatorLaunch;