import { useState } from 'react';
import styles from './UrgentSellForm.module.css';
import axios from 'axios';

const UrgentSellForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    comment: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // пока заглушка отправки, потом можно подключить API
      console.log('Заявка отправлена:', formData);
      alert('Заявка успешно отправлена!');
      onClose();
    } catch (error) {
      console.error('Ошибка при отправке заявки:', error);
      alert('Ошибка отправки.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2>Срочная продажа квартиры</h2>

      <input
        type="text"
        name="name"
        placeholder="Ваше имя"
        value={formData.name}
        onChange={handleChange}
        required
      />

      <input
        type="tel"
        name="phone"
        placeholder="Телефон"
        value={formData.phone}
        onChange={handleChange}
        required
      />

      <input
        type="text"
        name="address"
        placeholder="Адрес квартиры"
        value={formData.address}
        onChange={handleChange}
        required
      />

      <textarea
        name="comment"
        placeholder="Комментарий (необязательно)"
        value={formData.comment}
        onChange={handleChange}
        rows="4"
      />

      <button type="submit">Отправить заявку</button>
    </form>
  );
};

export default UrgentSellForm;
