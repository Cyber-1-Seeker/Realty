import React, {useState} from 'react';
import {motion} from 'framer-motion';
import styles from './AboutUs.module.css';

const AboutUs = () => {
    const [rooms, setRooms] = useState('');
    const [area, setArea] = useState('');
    const [city, setCity] = useState('');
    const [price, setPrice] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);


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
                    <button className={styles.openButton} onClick={() => setIsModalOpen(true)}>
                        Подробнее
                    </button>
                </div>
            </motion.section>
        </>
    );
};

export default AboutUs;
