import React from 'react';
import { useInView } from 'react-intersection-observer';
import styles from './Home2.module.css';
import heroImg from '@/assets/Listings/Hero4.png';
import DealTimelinePage from "@/components/pages/Home2/DealTimelinePage.jsx";
import WhyChooseUs from "@/components/pages/Home2/WhyChooseUs.jsx";
import AboutUsSection from "@/components/pages/Home2/AboutUsSection.jsx";
import CalculatorLaunch from "@/components/pages/Home2/CalculatorLaunch.jsx";
import {useTheme} from '@/context/ThemeContext';
import StatisticsSection from "@/components/pages/Home2/StatisticsSection.jsx";
import MapSection from "@/components/pages/Home2/MapSection.jsx";
import Testimonials from "@/components/pages/Home/Testimonials/Testimonials.jsx";
import Home2Footer from "@/components/pages/Home2/Home2Footer.jsx";

const Home2 = () => {
    const {theme, toggleTheme} = useTheme();
    
    // Хуки для анимации при скролле
    const { ref: dealRef, inView: dealInView } = useInView({ triggerOnce: true, threshold: 0.2 });
    const { ref: aboutRef, inView: aboutInView } = useInView({ triggerOnce: true, threshold: 0.2 });
    const { ref: whyRef, inView: whyInView } = useInView({ triggerOnce: true, threshold: 0.2 });
    const { ref: calcRef, inView: calcInView } = useInView({ triggerOnce: true, threshold: 0.2 });
    const { ref: mapRef, inView: mapInView } = useInView({ triggerOnce: true, threshold: 0.2 });
    const { ref: testimonialRef, inView: testimonialInView } = useInView({ triggerOnce: true, threshold: 0.2 });
    const { ref: footerRef, inView: footerInView } = useInView({ triggerOnce: true, threshold: 0.2 });

    return (
        <div
            className={
                styles.altBgWrapper + (theme === 'dark' ? ' ' + styles.dark : '')
            }
            style={{
                backgroundColor: theme === 'dark' ? '#181a1b' : 'white',
                minHeight: '100vh',
                width: '100vw',
                position: 'fixed',
                inset: 0,
                zIndex: 0,
                overflowY: 'auto',
                overflowX: 'hidden',
            }}
        >


            <div className={styles.pageWrapper}>
                <div className={styles.headerHeroContainer}>
                    <header className={styles.header}>
                        <div className={styles.logo}><span>STRACK </span><b>ESTATE</b></div>
                        <nav className={styles.navMenu}>
                            <a href="/" className={styles.active}>Главная</a>
                            <a href="/about">О нас</a>
                            <a href="/listings" className={styles.dropdown}>База квартир</a>
                            <a href="/profile">Профиль</a>
                        </nav>
                        <button className={styles.contactBtn}>Связаться с нами</button>
                        <button
                            className={styles.themeToggle}
                            onClick={toggleTheme}
                            aria-label={theme === 'light' ? 'Переключить на тёмную тему' : 'Переключить на светлую тему'}
                        >
                            <img
                                src={theme === 'light' ? '/icons/Home/sun-icon.png' : '/icons/Home/moon-icon.png'}
                                alt={theme === 'light' ? 'Луна' : 'Солнце'}
                                width={theme === 'light' ? '44' : '39'}
                                height={theme === 'light' ? '44' : '39'}
                                className={styles.themeIcon}
                            />
                        </button>
                    </header>

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
                            <form className={styles.searchForm}>
                                <input className={styles.input} type="text" placeholder="Ваше имя" required/>
                                <input className={styles.input} type="tel" placeholder="Номер телефона" required/>
                                <button className={styles.requestBtn} type="submit">Отправить заявку</button>
                            </form>
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
                <section ref={testimonialRef} className={`${styles.animSection} ${testimonialInView ? styles.visible : ''}`}>
                    <Testimonials theme={theme}/>
                </section>
                {/* Красивый футер */}
                <section ref={footerRef} className={`${styles.animSection} ${footerInView ? styles.visible : ''}`}>
                    <Home2Footer theme={theme}/>
                </section>
            </div>
        </div>
    );
};

export default Home2;