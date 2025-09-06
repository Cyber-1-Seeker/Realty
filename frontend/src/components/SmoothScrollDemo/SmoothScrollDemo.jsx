import React from 'react';
import useSmoothScroll from '../../hooks/useSmoothScroll';
import styles from './SmoothScrollDemo.module.css';

/**
 * Demo component showing how to use smooth scrolling
 * This can be used as reference for implementing smooth scroll controls
 */
const SmoothScrollDemo = () => {
  const { scrollToTop, scrollToBottom, scrollToElement } = useSmoothScroll();

  return (
    <div className={styles.demoContainer}>
      <h3>Smooth Scroll Controls</h3>
      <div className={styles.buttonGroup}>
        <button 
          onClick={scrollToTop}
          className={styles.scrollButton}
        >
          Scroll to Top
        </button>
        
        <button 
          onClick={() => scrollToElement('#middle-section')}
          className={styles.scrollButton}
        >
          Scroll to Middle
        </button>
        
        <button 
          onClick={scrollToBottom}
          className={styles.scrollButton}
        >
          Scroll to Bottom
        </button>
      </div>
    </div>
  );
};

export default SmoothScrollDemo;



