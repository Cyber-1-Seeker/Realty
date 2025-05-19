import React from 'react';
import {motion} from 'framer-motion';
import styles from './WhyUs.module.css';

const reasons = [
    {
        img: '/icons/Home/whyus.svg',
        title: 'До 100% рыночной стоимости',
        description: 'Мы предлагаем выгодные условия выкупа квартиры на рынке.'
    },
    {
        img: '/icons/Home/whyus2.svg',
        title: 'Срочный выкуп за 1 день',
        description: 'Оперативная оценка вашей недвижимости и аванс сразу.'
    },
    {
        img: '/icons/WhyUs/whyus3',
        title: 'Юридическая поддержка',
        description: 'Наши специалисты сопровождают сделку от начала до конца.'
    }
];

const WhyUs = () => {
    return (
        <motion.section
            className={styles.whyUs}
            initial={{opacity: 0, y: 50}}
            whileInView={{opacity: 1, y: 0}}
            transition={{duration: 0.6}}
            viewport={{once: true, amount: 0.2}}
        >
            <div className={styles.reasons}>
                <h2 className={styles.hyText}>Почему выбирают нас</h2>

                <div className={styles.reasonsGrid}>
                    {reasons.map((reason, index) => (
                        <div key={index} className={styles.reason}>
                            <img src={reason.img} alt={reason.title} className={styles.icon}/>
                            <h3>{reason.title}</h3>
                            <p>{reason.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </motion.section>
    );
};

export default WhyUs;
