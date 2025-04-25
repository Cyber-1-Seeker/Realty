import React from 'react'
import Hero from "./Hero/Hero.jsx";
import WhyUs from '../Home/WhyUs/WhyUs'
import ProcessSteps from '../Home/ProcessSteps/ProcessSteps'
import Testimonials from '../Home/Testimonials/Testimonials'
import CallToAction from '../Home/CallToAction/CallToAction'
import Services from "./Services/Services.jsx";
import MapSection from "./MapSection/MapSection.jsx";

import styles from './Home.module.css';


const Home = () => {
    return (
        <>
            <Hero/>
            <div className={styles.gradientBottom}></div>
            <section className="nextSection">
                <Services/>
            </section>
            <div className={styles.gradientTop}></div>
            <div className={styles.gradientBottom}></div>
            <section className="nextSection">
                <CallToAction/>
            </section>
            <div className={styles.gradientTop}></div>
            <div className={styles.gradientBottom}></div>
            <section className="nextSection">
                <WhyUs/>
            </section>
            <div className={styles.gradientTop}></div>
            <div className={styles.gradientBottom}></div>
            <section className="nextSection">
                <ProcessSteps/>
            </section>
            <div className={styles.gradientTop}></div>
            <MapSection/>
            <Testimonials/>
        </>
    )
}

export default Home
