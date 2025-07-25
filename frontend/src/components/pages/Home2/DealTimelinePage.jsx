import React from 'react';
import styles from './DealTimelinePage.module.css';

const steps = [
    {
        id: '01',
        title: 'Оставляете заявку',
        description: 'Вы оставляете заявку на сайте или связываетесь с менеджером.',
        progress: '0%',
    },
    {
        id: '02',
        title: 'Консультация',
        description: 'Мы обсуждаем ваши цели и предлагаем лучшие варианты.',
        progress: '20%',
    },
    {
        id: '03',
        title: 'Осмотр недвижимости',
        description: 'Организуем встречу для осмотра объекта.',
        progress: '40%',
    },
    {
        id: '04',
        title: 'Юридическая проверка',
        description: 'Юристы проверяют документы, готовим договор.',
        progress: '60%',
    },
    {
        id: '05',
        title: 'Подписание',
        description: 'Подписываем договор, готовим передачу прав.',
        progress: '80%',
    },
    {
        id: '06',
        title: 'Завершение сделки',
        description: 'Получаете ключи и документы — сделка завершена.',
        progress: '100%',
    },
];

const DealTimelinePage = () => {
    return (
        <div className={styles.wrapper}>
            <h1 className={styles.header}>Как проходит сделка</h1>
            <div className={styles.timeline}>
                {steps.map((step, idx) => (
                    <div
                        key={step.id}
                        className={`${styles.timelineItem} ${idx % 2 === 0 ? styles.left : styles.right}`}
                    >
                        <div className={styles.contentBox}>
                            <div className={styles.headerBox}>
                                <h2>{step.title}</h2>
                                <span className={styles.progress}>{step.progress}</span>
                            </div>
                            <p>{step.description}</p>
                        </div>
                        <div className={styles.circle}>{step.id}</div>
                    </div>
                ))}
                <div className={styles.verticalLine}></div>
            </div>
        </div>
    );
};

export default DealTimelinePage;