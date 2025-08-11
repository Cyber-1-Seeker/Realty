import React, { useState } from 'react';
import styles from './AuthModal.module.css';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const AuthModal = ({ onClose, onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);

  const handleSwitch = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>✖</button>
        {isLogin ? <LoginForm onSuccess={onAuthSuccess} /> : <RegisterForm onSuccess={onAuthSuccess} />}
        <div className={styles.switchText}>
          {isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}
          <button className={styles.switchButton} onClick={handleSwitch}>
            {isLogin ? 'Создать' : 'Войти'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
