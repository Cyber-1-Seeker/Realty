import React from 'react';
import { motion } from 'framer-motion';
import styles from './CalculatorLaunch.module.css';

const ModalForm = ({ isOpen, onClose, children, theme }) => {
    if (!isOpen) return null;
    return (
        <div className={styles.modalOverlay + (theme === 'dark' ? ' ' + styles.dark : '')} onClick={onClose}>
            <motion.div
                className={styles.modal + (theme === 'dark' ? ' ' + styles.dark : '')}
                onClick={(e) => e.stopPropagation()}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
            >
                <motion.button
                    className={styles.closeButton}
                    onClick={onClose}
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 6L6 18M6 6L18 18" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </motion.button>
                <div className={styles.modalContent}>
                    {children}
                </div>
            </motion.div>
        </div>
    );
};

export default ModalForm; 