import React, {useState} from 'react';
import styles from './UrgentSell.module.css';
import {motion} from 'framer-motion';
import ModalForm from "@/components/pages/Listings/ListingsPage/ModalForm.jsx";
import UrgentSellForm from "@/components/pages/Listings/ListingsPage/UrgentSellForm.jsx";
import AuthModal from "@/components/AuthModal/AuthModal.jsx";

const UrgentSell = () => {
    const [showUrgentForm, setShowUrgentForm] = useState(false);

    return (
        <motion.section
            className={styles.servicesWrapper}
            initial={{opacity: 0, y: 50}}
            whileInView={{opacity: 1, y: 0}}
            transition={{duration: 0.6}}
            viewport={{once: true, amount: 0.2}}
        >
            <div className={styles.servicesBox}>
                <h2>Нужно срочно продать квартиру?</h2>
                <h3><strong>Оставьте заявку, и мы свяжемся с вами в ближайшее время.</strong></h3>
                <button onClick={() => setShowUrgentForm(true)}>Оставить заявку</button>
            </div>

            <ModalForm isOpen={showUrgentForm} onClose={() => setShowUrgentForm(false)}>
                <UrgentSellForm onClose={() => setShowUrgentForm(false)}/>
            </ModalForm>
        </motion.section>


    )
        ;
};

export default UrgentSell;
