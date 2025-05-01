import React, { useState } from 'react';
import styles from './AuthModal.module.css';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const AuthModal = ({ onClose }) => {
  const [isLogin, setIsLogin] = useState(true);

  const handleSwitch = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>✖</button>
        <h2 className={styles.title}>
          {isLogin ? 'Войти в аккаунт' : 'Создать аккаунт'}
        </h2>
        {isLogin ? <LoginForm /> : <RegisterForm />}
        <p className={styles.switchText}>
          {isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}
          <button className={styles.switchButton} onClick={handleSwitch}>
            {isLogin ? 'Создать' : 'Войти'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthModal;
