import React from 'react';
import styles from './Home2.module.css';
import heroImg from '@/assets/Listings/Hero4.png';
import DealTimelinePage from "@/components/pages/Home2/DealTimelinePage.jsx";
import WhyChooseUs from "@/components/pages/Home2/WhyChooseUs.jsx";
import AboutUsSection from "@/components/pages/Home2/AboutUsSection.jsx";
import CalculatorLaunch from "@/components/pages/Home2/CalculatorLaunch.jsx";
import {useTheme} from '@/context/ThemeContext';
import StatisticsSection from "@/components/pages/Home2/StatisticsSection.jsx";

const Home2 = () => {
    const {theme, toggleTheme} = useTheme();

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
            <div className={styles.starsWrapper + (theme === 'dark' ? ' ' + styles.starsVisible : '')}>
                {[...Array(30)].map((_, i) => (
                    <div
                        key={i}
                        className={styles.star}
                        style={{
                            top: `${Math.random() * 80 + 5} %`,
                            left: `${Math.random() * 90 + 2}%`,
                            animationDelay: `${Math.random() * 2}s`
                        }}
                    />
                ))}
            </div>

            <div className={styles.pageWrapper}>
                <header className={styles.header}>
                    <div className={styles.logo}><span>STRACK </span><b>ESTATE</b></div>
                    <nav className={styles.navMenu}>
                        <a href="/">Home</a>
                        <a href="/about">About</a>
                        <a href="#" className={styles.dropdown}>Services</a>
                        <a href="#" className={styles.dropdown}>Pages</a>
                        <a href="/listings" className={styles.dropdown}>Property Listing</a>
                    </nav>
                    <button className={styles.contactBtn}>Contact us</button>
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
                            <div className={styles.filterCard}><input type="checkbox" id="buy"/><label
                                htmlFor="buy">Купить</label></div>

                            <div className={styles.filterCard}><input type="checkbox" id="sell"/><label
                                htmlFor="sell">Продать</label></div>
                            <div className={styles.filterCard}><input type="checkbox" id="rent"/><label
                                htmlFor="rent">Арендовать</label></div>
                        </div>
                        <section className={styles.searchBlock}>
                            <form className={styles.searchForm}>
                                <select className={styles.input} defaultValue="Москва">
                                    <option>Москва</option>
                                    <option>Санкт-Петербург</option>
                                    <option>Казань</option>
                                </select>
                                <select className={styles.input} defaultValue="Делюкс">
                                    <option>Делюкс</option>
                                    <option>Стандарт</option>
                                    <option>Премиум</option>
                                </select>
                                <input className={styles.input} type="text" placeholder="5 000–10 000 $"/>
                                <button className={styles.requestBtn} type="submit">Запросить информацию</button>
                            </form>
                        </section>
                    </div>
                    <div className={styles.heroImgBlock}>
                        <img src={heroImg} alt="Современный дом" className={styles.heroImg}/>
                    </div>
                </section>

                <section><DealTimelinePage/></section>
                <StatisticsSection/>
                <section><AboutUsSection/></section>
                <section><WhyChooseUs/></section>
                <section><CalculatorLaunch/></section>
            </div>
        </div>
    );
};

export default Home2;