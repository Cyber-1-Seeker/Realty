import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom';
import {motion, AnimatePresence} from 'framer-motion';
import styles from './AdvanceModal.module.css';
import AdvancePaymentForm from './AdvancePaymentForm';

const AdvanceModal = ({theme}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };
    const closeModal = () => setIsModalOpen(false);

    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'visible';
        }

        return () => {
            document.body.style.overflow = 'visible';
        };
    }, [isModalOpen]);

    return (
        <>
            <button
                className={styles.navLink + (theme === 'dark' ? ' ' + styles.dark : '')}
                onClick={openModal}
            >
                Получить аванс
            </button>

            {isModalOpen && (
                <div className={styles.modalOverlay + (theme === 'dark' ? ' ' + styles.dark : '')} onClick={closeModal}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <button
                            className={styles.closeButton + (theme === 'dark' ? ' ' + styles.dark : '')}
                            onClick={closeModal}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                        
                        <AdvancePaymentForm onClose={closeModal} theme={theme}/>
                    </div>
                </div>
            )}
        </>
    );
};

export default AdvanceModal;