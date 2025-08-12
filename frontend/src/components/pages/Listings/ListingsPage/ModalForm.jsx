// ModalForm.jsx
import React from 'react';
import ReactDOM from 'react-dom';
import { motion } from 'framer-motion';
import styles from './ModalForm.module.css';
import { useTheme } from '@/context/ThemeContext';

const ModalForm = ({ isOpen, onClose, children }) => {
    const { theme } = useTheme();
    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className={`${styles.overlay} ${theme === 'dark' ? styles.dark : ''}`} onClick={onClose}>
            <motion.div
                className={`${styles.modal} ${theme === 'dark' ? styles.dark : ''}`}
                onClick={(e) => e.stopPropagation()}
                initial={{ opacity: 0, y: -30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 30, scale: 0.95 }}
                transition={{ 
                    duration: 0.4, 
                    ease: "easeOut",
                    type: "spring",
                    stiffness: 300,
                    damping: 25
                }}
            >
                <motion.button
                    className={`${styles.closeButton} ${theme === 'dark' ? styles.dark : ''}`}
                    onClick={onClose}
                    whileHover={{ 
                        scale: 1.1, 
                        rotate: 90,
                        transition: { duration: 0.3, ease: "easeOut" }
                    }}
                    whileTap={{ 
                        scale: 0.9,
                        transition: { duration: 0.1, ease: "easeInOut" }
                    }}
                    initial={{ scale: 1, rotate: 0 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ 
                        duration: 0.3, 
                        ease: "easeOut",
                        type: "spring",
                        stiffness: 300,
                        damping: 20
                    }}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </motion.button>
                <div className={`${styles.modalContent} ${theme === 'dark' ? styles.dark : ''}`}>
                    {React.Children.map(children, child =>
                        React.isValidElement(child)
                            ? React.cloneElement(child, { theme })
                            : child
                    )}
                </div>
            </motion.div>
        </div>,
        document.body
    );
};

export default ModalForm;