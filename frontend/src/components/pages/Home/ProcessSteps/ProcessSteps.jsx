import React, { useState, useEffect } from 'react';
import styles from './ProcessSteps.module.css';
import { motion, useScroll, useTransform } from 'framer-motion';

// Импортируем иконки (замените пути на ваши SVG)
import ApplicationIcon from '/icons/Home/steps.svg';
import EvaluationIcon from '/icons/Home/steps2.svg';
import ContractIcon from '/icons/Home/steps3.svg';
import PaymentIcon from '/icons/Home/steps4.svg';

const ProcessSteps = () => {
    const [isMobile, setIsMobile] = useState(false);
    const { scrollYProgress } = useScroll();
    
    // Параллакс эффект для мобильных
    const y = useTransform(scrollYProgress, [0, 1], [0, -30]);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

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
                            initial={{ opacity: 0, x: isMobile ? 100 : 0, y: isMobile ? 0 : 50 }}
                            whileInView={{ 
                                opacity: 1, 
                                x: 0, 
                                y: 0,
                                transition: { 
                                    duration: 0.6, 
                                    delay: index * 0.15,
                                    ease: "easeOut"
                                }
                            }}
                            viewport={{ once: true, amount: 0.3 }}
                            whileHover={isMobile ? {} : { 
                                y: -8,
                                transition: { duration: 0.3 }
                            }}
                            style={isMobile ? { y } : {}}
                        >
                            {/* Линия-соединитель для дорожной карты */}
                            {isMobile && index < steps.length - 1 && (
                                <div className={styles.connectorLine}>
                                    <div className={styles.line}></div>
                                    <div className={styles.arrow}></div>
                                </div>
                            )}
                            
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