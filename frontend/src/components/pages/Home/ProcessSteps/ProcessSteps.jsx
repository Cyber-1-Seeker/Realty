import React, { useState, useEffect, useRef, useCallback } from 'react';
import styles from './ProcessSteps.module.css';
import { motion } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';

// Импортируем иконки (замените пути на ваши SVG)
import ApplicationIcon from '/icons/Home/steps.svg';
import EvaluationIcon from '/icons/Home/steps2.svg';
import ContractIcon from '/icons/Home/steps3.svg';
import PaymentIcon from '/icons/Home/steps4.svg';

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

const ProcessSteps = () => {
    const [isMobile, setIsMobile] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: false,
        align: 'start',
        skipSnaps: false,
        dragFree: false,
        slidesToScroll: 1,
        containScroll: 'trimSnaps',
        speed: 8,
    });

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Dots индикатор
    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setCurrentSlide(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        emblaApi.on('select', onSelect);
        onSelect();
        return () => {
            emblaApi.off('select', onSelect);
        };
    }, [emblaApi, onSelect]);

    // Стрелки (по желанию)
    const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

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
                {isMobile ? (
                  <div className={styles.embla}>
                    <div className={styles.emblaViewport} ref={emblaRef}>
                      <div className={styles.emblaContainer}>
                        {steps.map((step, index) => (
                          <motion.div
                            key={index}
                            className={styles.stepCard + ' ' + styles.emblaSlide}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                          >
                            {index < steps.length - 1 && (
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
                  </div>
                ) : (
                  <div className={styles.stepsGrid}>
                    {steps.map((step, index) => (
                      <motion.div
                        key={index}
                        className={styles.stepCard}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        whileHover={{
                          y: -8,
                          transition: { duration: 0.3 }
                        }}
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
                )}
                {/* Dots-индикатор для мобильных */}
                {isMobile && (
                    <div className={styles.dotsIndicator}>
                        {steps.map((_, index) => (
                            <div
                                key={index}
                                className={`${styles.dot} ${index === currentSlide ? styles.activeDot : ''}`}
                                onClick={() => emblaApi && emblaApi.scrollTo(index)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </motion.section>
    );
};

export default ProcessSteps;