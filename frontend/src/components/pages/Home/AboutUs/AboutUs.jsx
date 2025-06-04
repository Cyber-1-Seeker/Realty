import React from 'react';
import {Link} from 'react-router-dom';
import {motion} from 'framer-motion';
import styles from './AboutUs.module.css';

const AboutUs = () => {
    return (
        <>
            <motion.section
                className={styles.aboutUs}
                id="aboutus"
                initial={{opacity: 0, y: 50}}
                whileInView={{opacity: 1, y: 0}}
                transition={{duration: 0.6}}
                viewport={{once: true, amount: 0.2}}
            >
                <div className={styles.textBlock}>
                    <h2>Кто мы?</h2>
                    <p>
                        Мы компания, занимающаяся <strong>тем то и тем то и тем то и тем то, в прочем, довольно много чем на самом деле </strong>
                    </p>
                    <Link to="/about" >
                        <button className={styles.openButton}>
                            Подробнее
                        </button>
                    </Link>
                </div>
            </motion.section>
        </>
    );
};

export default AboutUs;
