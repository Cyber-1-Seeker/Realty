import React, {useEffect} from 'react'
import {useLocation} from 'react-router-dom' // Добавлено для работы с якорем
import Hero from "./Hero/Hero.jsx";
import WhyUs from '../Home/WhyUs/WhyUs'
import ProcessSteps from '../Home/ProcessSteps/ProcessSteps'
import Testimonials from '../Home/Testimonials/Testimonials'
import CallToAction from '../Home/CallToAction/CallToAction'
import Services from "./Services/Services.jsx";
import MapSection from "./MapSection/MapSection.jsx";
import AboutUs from "@/components/pages/Home/AboutUs/AboutUs.jsx";
import UrgentSell from "@/components/pages/Home/UrgentSell/UrgentSell.jsx";

// import styles from './Home.module.css';

const Home = ({isAuthenticated}) => {
    const location = useLocation(); // Добавлено для работы с якорем

    // Обработка якоря при загрузке страницы
    useEffect(() => {
        if (location.hash === '#calculator') {
            setTimeout(() => {
                const calculatorElement = document.getElementById('calculator');
                if (calculatorElement) {
                    calculatorElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }, 100);
        }
    }, [location]);

        useEffect(() => {
        if (location.hash === '#contacts') {
            setTimeout(() => {
                const contactsElement = document.getElementById('contacts');
                if (contactsElement) {
                    contactsElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }, 100);
        }
    }, [location]);

    return (
        <div className={styles.pageWrapper}>
            <Hero isAuthenticated={isAuthenticated}/>
            <div className={styles.gradientTop}></div>
            <div className={styles.gradientBottom}></div>

            <section className="nextSection">
                <UrgentSell/>
            </section>

            <div className={styles.gradientTop}></div>
            <div className={styles.gradientBottom}></div>
            <section className="nextSection">
                <AboutUs/>
            </section>
            <div className={styles.gradientTop}></div>
            <div className={styles.gradientBottom}></div>
            <section className="nextSection">
                <Services/>
            </section>
            <div className={styles.gradientTop}></div>
            <div className={styles.gradientBottom}></div>
            <section className="nextSection" id="calculator">
                <CallToAction/>
            </section>
            <section className="nextSection">
                <WhyUs/>
            </section>

            <section className="nextSection">
                <ProcessSteps/>
            </section>
            <div className={styles.gradientTop}></div>
            <MapSection id="contacts"/>
            <Testimonials/>
        </div>
    )
}

export default Home