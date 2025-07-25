import React, {useState} from 'react';
import styles from './CalculatorLaunch.module.css';
import OrderEvaluationForm from "@/components/pages/Home/CallToAction/OrderEvaluationForm.jsx";
import ModalForm from '@/components/pages/Listings/ListingsPage/ModalForm.jsx';


const CalculatorLaunch = ({onClick}) => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showOrderModal, setOrderModal] = useState(false);
    const [success, setSuccess] = useState(false);

    return (
        <section className={styles.section}>
            <div className={styles.wrapper}>
                <h2 className={styles.heading}>Рассчитайте стоимость квартиры за 1 минуту</h2>
                <p className={styles.subtext}>
                    Удобный калькулятор поможет быстро понять реальную рыночную цену.
                </p>
                <button onClick={onClick} className={styles.button}>
                    Открыть калькулятор
                </button>
            </div>

            <ModalForm
                isOpen={showOrderModal}
                onClose={() => setOrderModal(false)}
            >
                <OrderEvaluationForm
                    onClose={() => {
                        setOrderModal(false);
                        setSuccess(true);
                        setTimeout(() => setSuccess(false), 2000);
                    }}
                />
            </ModalForm>
        </section>
    );
};

export default CalculatorLaunch;