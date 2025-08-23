import React, {useState, useRef, useEffect} from 'react';
import {motion} from 'framer-motion';
import styles from './CallToAction.module.css';
import OrderEvaluationForm from '@/components/pages/Home2/OrderEvaluationForm.jsx';
import ModalForm from '@/components/pages/Listings/ListingsPage/ModalForm.jsx';

const CallToAction = () => {
    const [roomType, setRoomType] = useState('');
    const [area, setArea] = useState('');
    const [buildingType, setBuildingType] = useState('');
    const [renovation, setRenovation] = useState('');
    const [hasBalcony, setHasBalcony] = useState(false);
    const [price, setPrice] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState('');
    const modalContentRef = useRef(null);
    const resultRef = useRef(null);
    const [success, setSuccess] = useState(false);
    const [showOrderModal, setOrderModal] = useState(false);

    // Актуальные рыночные данные по Москве
    const BASE_PRICES = {
        studio: 270000,
        one: 290000,
        two: 280000,
        three: 265000,
        fourPlus: 250000
    };

    const BUILDING_COEFFICIENTS = {
        new: 1.10,
        secondary: 1.00,
        elite: 1.25
    };

    const RENOVATION_COEFFICIENTS = {
        none: 0.90,
        cosmetic: 1.00,
        designer: 1.20
    };

    const BALCONY_BONUS = 150000;

    const handleCalculate = (e) => {
        e.preventDefault();
        setError('');
        setPrice(null);

        // Валидация
        if (!roomType || !area || !buildingType || !renovation) {
            setError('Пожалуйста, заполните все обязательные поля');
            return;
        }

        const areaValue = parseFloat(area.replace(',', '.'));
        if (isNaN(areaValue)) {
            setError('Площадь должна быть числом');
            return;
        }
        if (areaValue <= 0) {
            setError('Площадь должна быть положительным числом');
            return;
        }
        if (areaValue > 1000) {
            setError('Укажите реальную площадь квартиры');
            return;
        }

        // Расчет стоимости
        const basePrice = BASE_PRICES[roomType];
        const buildingCoeff = BUILDING_COEFFICIENTS[buildingType];
        const renovationCoeff = RENOVATION_COEFFICIENTS[renovation];

        let calculatedPrice = basePrice * areaValue * buildingCoeff * renovationCoeff;

        if (hasBalcony) {
            calculatedPrice += BALCONY_BONUS;
        }

        setPrice(Math.round(calculatedPrice / 1000) * 1000);
    };

    useEffect(() => {
        if (price && resultRef.current && modalContentRef.current) {
            // Прокручиваем к результату
            resultRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'start'
            });
        }
    }, [price]);

    const formatPrice = (value) =>
        value.toLocaleString('ru-RU', {maximumFractionDigits: 0, useGrouping: true}) + ' ₽';

    return (
        <>
            <motion.section
                className={styles.cta}
                id="calculator"
                initial={{opacity: 0, y: 50}}
                whileInView={{opacity: 1, y: 0}}
                transition={{duration: 0.6}}
                viewport={{once: true, amount: 0.2}}
            >
                <div className={styles.textBlock}>
                    <h2>Узнайте стоимость вашей квартиры за 30 секунд</h2>
                    <p>
                        Наш калькулятор рассчитает стоимость квартиры <strong>с точностью до 96%</strong> на основе
                        текущих рыночных данных Москвы
                    </p>
                    <motion.button
                        className={styles.openButton}
                        onClick={() => setIsModalOpen(true)}
                        whileHover={{scale: 1.05}}
                        whileTap={{scale: 0.95}}
                    >
                        Бесплатный расчет
                    </motion.button>
                </div>
            </motion.section>

            {isModalOpen && (
                <motion.div
                    className={styles.modalOverlay}
                    onClick={() => setIsModalOpen(false)}
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    exit={{opacity: 0}}
                >
                    <motion.div
                        className={styles.modal}
                        onClick={(e) => e.stopPropagation()}
                        initial={{scale: 0.95, opacity: 0}}
                        animate={{scale: 1, opacity: 1}}
                        exit={{scale: 0.95, opacity: 0}}
                        transition={{
                            type: 'spring',
                            damping: 25,
                            stiffness: 300
                        }}
                    >
                        <button
                            className={styles.closeButton}
                            onClick={() => {
                                setIsModalOpen(false);
                                setPrice(null);
                                setError('');
                            }}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path d="M18 6L6 18M6 6L18 18" stroke="#4B5563" strokeWidth="2" strokeLinecap="round"
                                      strokeLinejoin="round"/>
                            </svg>
                        </button>

                        <div className={styles.modalHeader}>
                            <div className={styles.modalIcon}>
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M9 7H15M9 11H15M9 15H13M5 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3Z"
                                        stroke="#1E40AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            <h3>Калькулятор стоимости квартиры</h3>
                            <p className={styles.subtitle}>Рассчитайте стоимость недвижимости в Москве</p>
                        </div>

                        <div className={styles.modalContent} ref={modalContentRef}>
                            <form className={styles.form} onSubmit={handleCalculate}>
                                <div className={styles.formGroup}>
                                    <label>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"
                                                stroke="#4B5563" strokeWidth="2" strokeLinecap="round"
                                                strokeLinejoin="round"/>
                                            <path d="M9 22V12H15V22" stroke="#4B5563" strokeWidth="2"
                                                  strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                        Тип квартиры *
                                    </label>
                                    <div className={styles.selectContainer}>
                                        <select
                                            value={roomType}
                                            onChange={(e) => setRoomType(e.target.value)}
                                            className={styles.select}
                                        >
                                            <option value="">Выберите тип</option>
                                            <option value="studio">Студия</option>
                                            <option value="one">1-комнатная</option>
                                            <option value="two">2-комнатная</option>
                                            <option value="three">3-комнатная</option>
                                            <option value="fourPlus">4+ комнат</option>
                                        </select>
                                        <svg className={styles.selectArrow} width="16" height="16" viewBox="0 0 24 24"
                                             fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M6 9L12 15L18 9" stroke="#4B5563" strokeWidth="2"
                                                  strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </div>
                                </div>

                                <div className={styles.formGroup}>
                                    <label>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path d="M2 5H12M12 5L9 2M12 5L9 8" stroke="#4B5563" strokeWidth="2"
                                                  strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M4 19H20" stroke="#4B5563" strokeWidth="2" strokeLinecap="round"
                                                  strokeLinejoin="round"/>
                                            <path d="M4 15H20" stroke="#4B5563" strokeWidth="2" strokeLinecap="round"
                                                  strokeLinejoin="round"/>
                                            <path d="M4 11H20" stroke="#4B5563" strokeWidth="2" strokeLinecap="round"
                                                  strokeLinejoin="round"/>
                                            <path
                                                d="M2 5V19C2 19.5304 2.21071 20.0391 2.58579 20.4142C2.96086 20.7893 3.46957 21 4 21H20C20.5304 21 21.0391 20.7893 21.4142 20.4142C21.7893 20.0391 22 19.5304 22 19V5C22 4.46957 21.7893 3.96086 21.4142 3.58579C21.0391 3.21071 20.5304 3 20 3H4C3.46957 3 2.96086 3.21071 2.58579 3.58579C2.21071 3.96086 2 4.46957 2 5Z"
                                                stroke="#4B5563" strokeWidth="2" strokeLinecap="round"
                                                strokeLinejoin="round"/>
                                        </svg>
                                        Площадь (м²) *
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Например: 45.5"
                                        value={area}
                                        onChange={(e) => setArea(e.target.value)}
                                        className={styles.input}
                                    />
                                </div>

                                <div className={styles.formColumns}>
                                    <div className={styles.formGroup}>
                                        <label>
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                                                 xmlns="http://www.w3.org/2000/svg">
                                                <path d="M3 21H21" stroke="#4B5563" strokeWidth="2"
                                                      strokeLinecap="round" strokeLinejoin="round"/>
                                                <path
                                                    d="M5 21V7C5 6.46957 5.21071 5.96086 5.58579 5.58579C5.96086 5.21071 6.46957 5 7 5H9"
                                                    stroke="#4B5563" strokeWidth="2" strokeLinecap="round"
                                                    strokeLinejoin="round"/>
                                                <path
                                                    d="M19 21V11C19 10.4696 18.7893 9.96086 18.4142 9.58579C18.0391 9.21071 17.5304 9 17 9H14"
                                                    stroke="#4B5563" strokeWidth="2" strokeLinecap="round"
                                                    strokeLinejoin="round"/>
                                                <path d="M9 8H9.01" stroke="#4B5563" strokeWidth="2"
                                                      strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M9 12H9.01" stroke="#4B5563" strokeWidth="2"
                                                      strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M9 16H9.01" stroke="#4B5563" strokeWidth="2"
                                                      strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M14 13H14.01" stroke="#4B5563" strokeWidth="2"
                                                      strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M14 17H14.01" stroke="#4B5563" strokeWidth="2"
                                                      strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                            Тип дома *
                                        </label>
                                        <div className={styles.selectContainer}>
                                            <select
                                                value={buildingType}
                                                onChange={(e) => setBuildingType(e.target.value)}
                                                className={styles.select}
                                            >
                                                <option value="">Выберите тип</option>
                                                <option value="new">Новостройка</option>
                                                <option value="secondary">Вторичка</option>
                                                <option value="elite">Элитное жилье</option>
                                            </select>
                                            <svg className={styles.selectArrow} width="16" height="16"
                                                 viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M6 9L12 15L18 9" stroke="#4B5563" strokeWidth="2"
                                                      strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </div>
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label>
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                                                 xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M14 7H18M14 11H16M6 20H18C19.1046 20 20 19.1046 20 18V6C20 4.89543 19.1046 4 18 4H6C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20Z"
                                                    stroke="#4B5563" strokeWidth="2" strokeLinecap="round"
                                                    strokeLinejoin="round"/>
                                            </svg>
                                            Ремонт *
                                        </label>
                                        <div className={styles.selectContainer}>
                                            <select
                                                value={renovation}
                                                onChange={(e) => setRenovation(e.target.value)}
                                                className={styles.select}
                                            >
                                                <option value="">Выберите состояние</option>
                                                <option value="none">Без ремонта</option>
                                                <option value="cosmetic">Косметический</option>
                                                <option value="designer">Дизайнерский</option>
                                            </select>
                                            <svg className={styles.selectArrow} width="16" height="16"
                                                 viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M6 9L12 15L18 9" stroke="#4B5563" strokeWidth="2"
                                                      strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.checkboxGroup}>
                                    <input
                                        type="checkbox"
                                        id="balcony"
                                        checked={hasBalcony}
                                        onChange={(e) => setHasBalcony(e.target.checked)}
                                        className={styles.checkboxInput}
                                    />
                                    <label htmlFor="balcony" className={styles.checkboxLabel}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M4 13H20M4 13C2.89543 13 2 12.1046 2 11V5C2 3.89543 2.89543 3 4 3H20C21.1046 3 22 3.89543 22 5V11C22 12.1046 21.1046 13 20 13M4 13V19C4 20.1046 4.89543 21 6 21H18C19.1046 21 20 20.1046 20 19V13"
                                                stroke="#4B5563" strokeWidth="2" strokeLinecap="round"
                                                strokeLinejoin="round"/>
                                        </svg>
                                        Есть балкон/лоджия (+150 тыс ₽)
                                    </label>
                                </div>

                                {error && <div className={styles.error}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
                                            stroke="#DC2626" strokeWidth="2" strokeLinecap="round"
                                            strokeLinejoin="round"/>
                                    </svg>
                                    {error}
                                </div>}

                                <motion.button
                                    type="submit"
                                    className={styles.submitButton}
                                    whileHover={{scale: 1.03}}
                                    whileTap={{scale: 0.98}}
                                >
                                    Рассчитать стоимость
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9 5L16 12L9 19" stroke="white" strokeWidth="2" strokeLinecap="round"
                                              strokeLinejoin="round"/>
                                    </svg>
                                </motion.button>
                            </form>

                            {price && (
                                <motion.div
                                    className={styles.result}
                                    initial={{opacity: 0, height: 0}}
                                    animate={{opacity: 1, height: 'auto'}}
                                    transition={{duration: 0.3}}
                                    ref={resultRef}
                                >
                                    <div className={styles.resultHeader}>
                                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path d="M20 6L9 17L4 12" stroke="#1E40AF" strokeWidth="2"
                                                  strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                        <div>
                                            <h4>Оценочная стоимость квартиры</h4>
                                            <p className={styles.price}>{formatPrice(price)}</p>
                                        </div>
                                    </div>
                                    <p className={styles.disclaimer}>*Расчет является предварительным. Для точной оценки
                                        свяжитесь с нашим специалистом.</p>

                                    <div className={styles.resultActions}>
                                        <button
                                            className={styles.secondaryButton}
                                            onClick={() => {
                                                setPrice(null);
                                                setError('');
                                            }}
                                        >
                                            Новый расчет
                                        </button>
                                        <button
                                            className={styles.primaryButton}
                                            onClick={() => {
                                                setIsModalOpen(false);
                                                setOrderModal(true);
                                            }}
                                        >
                                            Заказать оценку
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                                 xmlns="http://www.w3.org/2000/svg">
                                                <path d="M5 12H19M12 5L19 12L12 19" stroke="#1E40AF" strokeWidth="2"
                                                      strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
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

export default CallToAction;












