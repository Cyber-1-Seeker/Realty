import React from 'react';
import styles from './WhyChooseUs.module.css';

const features = [
    {
        id: '01',
        title: 'Широкий выбор объектов',
        description: 'Тысячи предложений: от эконом до премиум-класса по всей России.',
        icon: '🏙',
    },
    {
        id: '02',
        title: 'Безопасность сделки',
        description: 'Юридическое сопровождение и проверка каждого объекта.',
        icon: '🛡',
    },
    {
        id: '03',
        title: 'Поддержка 24/7',
        description: 'Наши специалисты всегда на связи и готовы помочь.',
        icon: '💬',
    },
    {
        id: '04',
        title: 'Прозрачные условия',
        description: 'Без скрытых комиссий. Всё чётко и по делу.',
        icon: '📄',
    },
];

const WhyChooseUs = ({ theme }) => {
    return (
        <section className={styles.section + (theme === 'dark' ? ' ' + styles.dark : '')}>
            <h2 className={styles.heading}>Почему выбирают нас</h2>
            <div className={styles.subheading}>Наши преимущества</div>
            <div className={styles.grid}>
                {features.map((item) => (
                    <div key={item.id} className={styles.card}>
                        <div className={styles.icon}>{item.icon}</div>
                        <h3 className={styles.title}>{item.title}</h3>
                        <p className={styles.description}>{item.description}</p>
                        <div className={styles.number}>{item.id}</div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default WhyChooseUs;