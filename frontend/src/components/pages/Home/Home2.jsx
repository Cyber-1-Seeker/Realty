import React from 'react';
import styles from './Home2.module.css';

// Пути к изображениям и svg — как в Home
import heroImg from '@/assets/Listings/Hero3.png';

const Home2 = () => {
    return (
        <div className={styles.pageWrapper}>
            {/* Хедер */}
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
            </header>

            {/* Hero-секция */}
            <section className={styles.heroSection}>
                <div className={styles.heroTextBlock}>
                    <span className={styles.heroSubtitle}>Платформа для поиска недвижимости</span>
                    <h1 className={styles.heroTitle}>Найдите дом своей мечты</h1>
                    <div className={styles.filterCards}>
                        <div className={styles.filterCard}><input type="checkbox" id="buy" /><label htmlFor="buy">Купить</label></div>
                        <div className={styles.filterCard}><input type="checkbox" id="sell" /><label htmlFor="sell">Продать</label></div>
                        <div className={styles.filterCard}><input type="checkbox" id="rent" /><label htmlFor="rent">Арендовать</label></div>
                    </div>
                </div>
                <div className={styles.heroImgBlock}>
                    <img src={heroImg} alt="Современный дом" className={styles.heroImg + ' ' + styles.heroImgLarge}/>
                </div>
            </section>

            {/* Поисковый блок */}
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
                    <input className={styles.input} type="text" placeholder="5 000–10 000 $" />
                    <button className={styles.requestBtn} type="submit">Запросить информацию</button>
                </form>
            </section>
        </div>
    );
};

export default Home2; 