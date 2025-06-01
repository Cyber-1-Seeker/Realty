import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Result } from 'antd';
import { ToolOutlined } from '@ant-design/icons';
import styles from './Support.module.css';

const Support = () => {
  return (
    <div className={styles.container}>
      <Result
        icon={<ToolOutlined className={styles.icon} />}
        title="Страница поддержки в разработке"
        subTitle="Мы активно работаем над созданием удобной системы поддержки для вас!"
        extra={
          <div className={styles.actions}>
            <Link to="/">
              <Button type="primary" size="large">
                Вернуться на главную
              </Button>
            </Link>
          </div>
        }
      />

      <div className={styles.infoCard}>
        <h3>Как получить помощь прямо сейчас?</h3>
        <ul className={styles.contactList}>
          <li>
            <strong>Email:</strong> support@realty-express.ru
          </li>
          <li>
            <strong>Телефон:</strong> +7 (495) 123-45-67
          </li>
          <li>
            <strong>Telegram:</strong> @realty_support_bot
          </li>
          <li>
            <strong>Часы работы:</strong> Пн-Пт: 9:00-21:00, Сб-Вс: 10:00-18:00
          </li>
        </ul>

        <div className={styles.progressInfo}>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: '65%' }}></div>
          </div>
          <p>Разработка завершена на 65%</p>
        </div>
      </div>
    </div>
  );
};

export default Support;