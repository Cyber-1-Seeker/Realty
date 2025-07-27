import React, { useState, useRef } from 'react';
import styles from './CalculatorLaunch.module.css';
import OrderEvaluationForm from "@/components/pages/Home/CallToAction/OrderEvaluationForm.jsx";
import ModalForm from '@/components/pages/Listings/ListingsPage/ModalForm.jsx';
import clsx from 'clsx';

const CalculatorLaunch = () => {
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [success, setSuccess] = useState(false);
  const [hoveringButton, setHoveringButton] = useState(false);
  const [activeButtonIndex, setActiveButtonIndex] = useState(null);
  const buttonRefs = useRef([]);

  buttonRefs.current = Array(10).fill().map((_, i) => buttonRefs.current[i] || React.createRef());

  const handleButtonMouseMove = (e, index) => {
    const button = buttonRefs.current[index].current;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const offsetX = e.clientX - centerX;
    const offsetY = e.clientY - centerY;

    const dx = -offsetX / 4;
    const dy = -offsetY / 4;

    button.style.transform = `translate(${dx}px, ${dy}px)`;
    setActiveButtonIndex(index);
  };

  const handleButtonMouseLeave = (index) => {
    const button = buttonRefs.current[index].current;
    if (button) {
      button.style.transform = 'translate(0, 0)';
      setActiveButtonIndex(null);
    }
  };

  return (
    <section className={styles.section}>
      <div className={styles.wrapper}>
        <div className={clsx(styles.calculatorContainer, hoveringButton && styles.calculatorRaised)}>
          <svg
            viewBox="0 0 120 160"
            xmlns="http://www.w3.org/2000/svg"
            className={styles.calculatorSvg}
          >
            <rect x="10" y="10" rx="16" ry="16" width="100" height="140" className={styles.body} />
            <rect x="25" y="22" width="70" height="26" rx="6" className={styles.screen} />
            <circle cx="45" cy="35" r="3.5" fill="#2c63ff" />
            <circle cx="75" cy="35" r="3.5" fill="#2c63ff" />
            <path d="M45 40 Q60 50 75 40" stroke="#2c63ff" strokeWidth="2" fill="none" />

            <g className={styles.buttons}>
              {Array.from({ length: 9 }).map((_, i) => {
                const col = i % 3;
                const row = Math.floor(i / 3);
                return (
                  <foreignObject
                    key={i}
                    x={30 + col * 30 - 10}
                    y={70 + row * 25 - 10}
                    width="20"
                    height="20"
                  >
                    <div
                      ref={buttonRefs.current[i]}
                      className={styles.movableButton}
                      onMouseMove={(e) => handleButtonMouseMove(e, i)}
                      onMouseLeave={() => handleButtonMouseLeave(i)}
                    >
                      <div className={clsx(
                        styles.movableInner,
                        (hoveringButton || activeButtonIndex === i) && styles.yellowInner
                      )} />
                    </div>
                  </foreignObject>
                );
              })}

              <foreignObject x="30" y="145" width="60" height="10">
                <div
                  ref={buttonRefs.current[9]}
                  className={styles.equalsButtonWrapper}
                  onMouseMove={(e) => handleButtonMouseMove(e, 9)}
                  onMouseLeave={() => handleButtonMouseLeave(9)}
                >
                  <div className={clsx(
                    styles.equalsButtonInner,
                    (hoveringButton || activeButtonIndex === 9) && styles.yellowInner
                  )} />
                </div>
              </foreignObject>
            </g>
          </svg>
        </div>

        <div className={styles.contentCenter}>
          <h2 className={styles.heading}>Рассчитайте стоимость квартиры за 1 минуту</h2>
          <p className={styles.subtext}>
            Удобный калькулятор поможет быстро понять реальную рыночную цену.
          </p>
          <button
            onClick={() => setShowOrderModal(true)}
            className={styles.button}
            onMouseEnter={() => setHoveringButton(true)}
            onMouseLeave={() => setHoveringButton(false)}
          >
            Открыть калькулятор
          </button>
        </div>
      </div>

      <ModalForm
        isOpen={showOrderModal}
        onClose={() => setShowOrderModal(false)}
      >
        <OrderEvaluationForm
          onClose={() => {
            setShowOrderModal(false);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 2000);
          }}
        />
      </ModalForm>
    </section>
  );
};

export default CalculatorLaunch;