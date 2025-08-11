import React, {useState, useEffect} from 'react';
import {useInView} from 'react-intersection-observer';
import styles from './Home2.module.css';
import heroImg from '@/assets/Listings/Hero4.png';
import DealTimelinePage from "@/components/pages/Home2/DealTimeline/DealTimelinePage.jsx";
import WhyChooseUs from "@/components/pages/Home2/WhyChooseUs/WhyChooseUs.jsx";
import AboutUsSection from "@/components/pages/Home2/AboutUsSection/AboutUsSection.jsx";
import CalculatorLaunch from "@/components/pages/Home2/CalculatorLaunch/CalculatorLaunch.jsx";
import {useTheme} from '@/context/ThemeContext.jsx';
import StatisticsSection from "@/components/pages/Home2/StatisticsSection/StatisticsSection.jsx";
import MapSection from "@/components/pages/Home2/MapSection/MapSection.jsx";
import Testimonials from "@/components/pages/Home/Testimonials/Testimonials.jsx";
import Home2Footer from "@/components/pages/Home2/Footer/Home2Footer.jsx";
import OrderEvaluationForm from "@/components/pages/Home2/OrderEvaluationForm.jsx";

const Home2 = () => {
    const {theme, toggleTheme} = useTheme();
    const [showOrderForm, setShowOrderForm] = useState(false);

    // Отладочная информация
    useEffect(() => {
        console.log('showOrderForm изменился:', showOrderForm);
    }, [showOrderForm]);

    // Хуки для анимации при скролле
    const {ref: dealRef, inView: dealInView} = useInView({triggerOnce: true, threshold: 0.2});
    const {ref: aboutRef, inView: aboutInView} = useInView({triggerOnce: true, threshold: 0.2});
    const {ref: whyRef, inView: whyInView} = useInView({triggerOnce: true, threshold: 0.2});
    const {ref: calcRef, inView: calcInView} = useInView({triggerOnce: true, threshold: 0.2});
    const {ref: mapRef, inView: mapInView} = useInView({triggerOnce: true, threshold: 0.2});
    const {ref: testimonialRef, inView: testimonialInView} = useInView({triggerOnce: true, threshold: 0.2});
    const {ref: footerRef, inView: footerInView} = useInView({triggerOnce: true, threshold: 0.2});

    return (
        <div className={styles.altBgWrapper + (theme === 'dark' ? ' ' + styles.dark : '')}>
            <div className={styles.pageWrapper}>
                <div className={styles.headerHeroContainer}>
                    {/* Header removed - using global header */}

                    <section className={styles.heroSection}>
                        <div className={styles.bgDotRed}></div>
                        <div className={styles.bgDotGreen}></div>
                        <div className={styles.bgDotBlue}></div>
                        <div className={styles.bgLineRight}></div>
                        <div className={styles.bgLineLeft}></div>
                        <div className={styles.heroTextBlock}>
                            <span className={styles.heroSubtitle}>Платформа для поиска недвижимости</span>
                            <h1 className={styles.heroTitle}>Найдите дом своей мечты</h1>
                            <div className={styles.filterCards}>
                                <div className={styles.filterCard + ' ' + styles.checked}>
                                    <span className={styles.checkIcon}>✓</span>
                                    <span>Купить</span>
                                </div>
                                <div className={styles.filterCard + ' ' + styles.checked}>
                                    <span className={styles.checkIcon}>✓</span>
                                    <span>Продать</span>
                                </div>
                                <div className={styles.filterCard + ' ' + styles.checked}>
                                    <span className={styles.checkIcon}>✓</span>
                                    <span>Арендовать</span>
                                </div>
                            </div>
                            <section className={styles.searchBlock}>
                                <div className={styles.searchForm}>
                                    <input className={styles.input} type="text" placeholder="Ваше имя" />
                                    <input className={styles.input} type="tel" placeholder="Номер телефона" />
                                    <button 
                                        className={styles.requestBtn} 
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            console.log('Кнопка нажата, showOrderForm:', showOrderForm);
                                            setShowOrderForm(true);
                                        }}
                                    >
                                        Отправить заявку
                                    </button>
                                </div>
                            </section>
                        </div>
                        <div className={styles.heroImgBlock}>
                            <img src={heroImg} alt="Современный дом" className={styles.heroImg}/>
                        </div>
                    </section>
                </div>

                <section ref={dealRef} className={`${styles.animSection} ${dealInView ? styles.visible : ''}`}>
                    <DealTimelinePage theme={theme}/>
                </section>
                <section><StatisticsSection theme={theme}/></section>
                <section ref={aboutRef} className={`${styles.animSection} ${aboutInView ? styles.visible : ''}`}>
                    <AboutUsSection theme={theme}/>
                </section>
                <section ref={whyRef} className={`${styles.animSection} ${whyInView ? styles.visible : ''}`}>
                    <WhyChooseUs theme={theme}/>
                </section>
                <section ref={calcRef} className={`${styles.animSection} ${calcInView ? styles.visible : ''}`}>
                    <CalculatorLaunch theme={theme}/>
                </section>
                <section ref={mapRef} className={`${styles.animSection} ${mapInView ? styles.visible : ''}`}>
                    <MapSection theme={theme}/>
                </section>
                <section ref={testimonialRef}
                         className={`${styles.animSection} ${testimonialInView ? styles.visible : ''}`}>
                    <Testimonials theme={theme}/>
                </section>
                {/* Красивый футер */}
                <section ref={footerRef} className={`${styles.animSection} ${footerInView ? styles.visible : ''}`}>
                    <Home2Footer theme={theme}/>
                </section>
            </div>
            
            {/* Модальное окно для заказа оценки */}
            {showOrderForm && (
                <div className={styles.modalOverlay} onClick={() => setShowOrderForm(false)}>
                    <div onClick={(e) => e.stopPropagation()}>
                        <OrderEvaluationForm 
                            onClose={() => setShowOrderForm(false)} 
                            theme={theme} 
                        />
                    </div>
                </div>
            )}
            {console.log('showOrderForm состояние:', showOrderForm)}
        </div>
    );
};

export default Home2;