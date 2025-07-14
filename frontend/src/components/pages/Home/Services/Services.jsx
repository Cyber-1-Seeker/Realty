import React, { useState, useEffect } from 'react';
import styles from './Services.module.css';
import { motion, useScroll, useTransform } from 'framer-motion';

const services = [
  {
    img: '/icons/Home/services.svg',
    title: 'Срочный выкуп',
    description: 'Покупаем квартиру за 1 день. Аванс сразу.'
  },
  {
    img: '/icons/Home/services2.svg',
    title: 'Альтернатива',
    description: 'Обмен квартиры с доплатой или без.'
  },
  {
    img: '/icons/Home/services3.svg',
    title: 'Юрист бесплатно',
    description: 'Проверим документы и решим любые вопросы.'
  },
  {
    img: '/icons/Home/services4.svg',
    title: 'Выкуп долей',
    description: 'Покупаем комнаты и доли по рыночной цене.'
  }
];

const Services = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { scrollYProgress } = useScroll();
  
  // Параллакс эффект для мобильных
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Отслеживание скролла для dots-индикатора
  useEffect(() => {
    if (!isMobile) return;
    
    const cardsContainer = document.querySelector(`.${styles.cards}`);
    if (!cardsContainer) return;
    
    const handleScroll = () => {
      const scrollLeft = cardsContainer.scrollLeft;
      const cardWidth = 280 + 20; // ширина карточки + отступ
      const newSlide = Math.round(scrollLeft / cardWidth);
      setCurrentSlide(newSlide);
    };
    
    cardsContainer.addEventListener('scroll', handleScroll);
    return () => cardsContainer.removeEventListener('scroll', handleScroll);
  }, [isMobile]);

  // Варианты анимации для одновременного появления
  const cardVariants = {
    hidden: { opacity: 0, y: isMobile ? 40 : 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  return (
    <motion.section
      className={styles.servicesWrapper}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className={styles.servicesBox}>
        <h2>Наши услуги</h2>
        <div className={styles.cards}>
          {services.map((s, i) => (
            <motion.div 
              key={i} 
              className={styles.card}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              whileHover={isMobile ? {} : { 
                y: -8,
                transition: { duration: 0.3 }
              }}
              style={isMobile ? { y } : {}}
            >
              <motion.img 
                src={s.img} 
                alt={s.title} 
                className={styles.icon}
                whileHover={isMobile ? { scale: 1.1 } : {}}
                transition={{ duration: 0.3 }}
              />
              <h3>{s.title}</h3>
              <p>{s.description}</p>
            </motion.div>
          ))}
        </div>
        
        {/* Dots-индикатор для мобильных */}
        {isMobile && (
          <div className={styles.dotsIndicator}>
            {services.map((_, index) => (
              <div
                key={index}
                className={`${styles.dot} ${index === currentSlide ? styles.activeDot : ''}`}
              />
            ))}
          </div>
        )}
      </div>
    </motion.section>
  );
};

export default Services;
