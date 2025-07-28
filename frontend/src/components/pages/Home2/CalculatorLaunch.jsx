import React, {useState} from 'react';
import styles from './CalculatorLaunch.module.css';
import OrderEvaluationForm from "@/components/pages/Home/CallToAction/OrderEvaluationForm.jsx";
import ModalForm from '@/components/pages/Listings/ListingsPage/ModalForm.jsx';
import CallToAction from '@/components/pages/Home/CallToAction/CallToAction.jsx';

const CalculatorLaunch = () => {
    const [showCalculator, setShowCalculator] = useState(false);
    const [showOrderModal, setOrderModal] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleOpenCalculator = () => {
        setShowCalculator(true);
        // Прокручиваем к калькулятору
        setTimeout(() => {
            const calculatorElement = document.getElementById('calculator');
            if (calculatorElement) {
                calculatorElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }, 100);
    };

    const handleCloseCalculator = () => {
        setShowCalculator(false);
    };

    return (
        <>
            <section className={styles.section}>
                <div className={styles.wrapper}>
                    <h2 className={styles.heading}>Рассчитайте стоимость квартиры за 1 минуту</h2>
                    <p className={styles.subtext}>
                        Удобный калькулятор поможет быстро понять реальную рыночную цену.
                    </p>
                    <button onClick={handleOpenCalculator} className={styles.button}>
                        Открыть калькулятор
                    </button>
                </div>
            </section>

            {showCalculator && (
                <div id="calculator">
                    <div style={{ textAlign: 'center', padding: '20px 0' }}>
                        <button 
                            onClick={handleCloseCalculator}
                            style={{
                                background: 'rgba(255, 255, 255, 0.9)',
                                border: '2px solid #2c63ff',
                                color: '#2c63ff',
                                padding: '10px 20px',
                                borderRadius: '25px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: '600',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseOver={(e) => {
                                e.target.style.background = '#2c63ff';
                                e.target.style.color = 'white';
                            }}
                            onMouseOut={(e) => {
                                e.target.style.background = 'rgba(255, 255, 255, 0.9)';
                                e.target.style.color = '#2c63ff';
                            }}
                        >
                            ← Вернуться к основному контенту
                        </button>
                    </div>
                    <CallToAction onClose={handleCloseCalculator} />
                </div>
            )}

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
        </>
    );
};

export default CalculatorLaunch;