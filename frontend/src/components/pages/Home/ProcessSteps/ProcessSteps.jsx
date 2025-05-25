import React from 'react';
import styles from './ProcessSteps.module.css';
import { motion } from 'framer-motion';

// Импортируем иконки (замените пути на ваши SVG)
import ApplicationIcon from '/icons/Home/steps.svg';
import EvaluationIcon from '/icons/Home/steps2.svg';
import ContractIcon from '/icons/Home/steps3.svg';
import PaymentIcon from '/icons/Home/steps4.svg';

const ProcessSteps = () => {
    const steps = [
        {
            icon: ApplicationIcon,
            title: 'Заявка',
            description: 'Оставьте заявку или позвоните — мы свяжемся с вами в течение 15 минут.'
        },
        {
            icon: EvaluationIcon,
            title: 'Оценка',
            description: 'Оценим квартиру по рыночной стоимости в день обращения.'
        },
        {
            icon: ContractIcon,
            title: 'Договор',
            description: 'Согласуем условия и оформим договор выкупа.'
        },
        {
            icon: PaymentIcon,
            title: 'Аванс и оплата',
            description: 'Вы получаете аванс сразу после подписания и полную оплату при расчёте.'
        }
    ];

    return (
        <motion.section
            className={styles.process}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.2 }}
        >
            <div className={styles.container}>
                <h2 className={styles.title}>Как проходит выкуп</h2>

                <div className={styles.stepsGrid}>
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            className={styles.stepCard}
                            whileHover={{ y: -5 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className={styles.iconWrapper}>
                                <img
                                    src={step.icon}
                                    alt={step.title}
                                    className={styles.stepIcon}
                                />
                                <span className={styles.stepNumber}>{index + 1}</span>
                            </div>
                            <h3 className={styles.stepTitle}>{step.title}</h3>
                            <p className={styles.stepDescription}>{step.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.section>
    );
};

export default ProcessSteps;