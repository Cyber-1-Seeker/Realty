import React, { useState, useEffect, useRef, useCallback } from 'react';
import styles from './Services.module.css';
import { motion } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';

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
      className={styles.servicesWrapper}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className={styles.servicesBox}>
        <h2>Наши услуги</h2>
        {isMobile ? (
          <div className={styles.embla}>
            <div className={styles.emblaViewport} ref={emblaRef}>
              <div className={styles.emblaContainer}>
                {services.map((s, i) => (
                  <motion.div
                    key={i}
                    className={styles.card + ' ' + styles.emblaSlide}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                  >
                    <motion.img
                      src={s.img}
                      alt={s.title}
                      className={styles.icon}
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    />
                    <h3>{s.title}</h3>
                    <p>{s.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.cards}>
            {services.map((s, i) => (
              <motion.div
                key={i}
                className={styles.card}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                whileHover={{
                  y: -8,
                  transition: { duration: 0.3 }
                }}
              >
                <motion.img
                  src={s.img}
                  alt={s.title}
                  className={styles.icon}
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                />
                <h3>{s.title}</h3>
                <p>{s.description}</p>
              </motion.div>
            ))}
          </div>
        )}
        {/* Dots-индикатор для мобильных */}
        {isMobile && (
          <div className={styles.dotsIndicator}>
            {services.map((_, index) => (
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

export default Services;
