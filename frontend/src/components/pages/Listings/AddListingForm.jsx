import { useState } from 'react';
import axios from 'axios';
import styles from './AddListingForm.module.css';

const AddListingForm = () => {
  const [formData, setFormData] = useState({
    address: '',
    price: '',
    floor: '',
    image: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = new FormData();
    for (let key in formData) {
      payload.append(key, formData[key]);
    }

    try {
      const res = await axios.post('http://127.0.0.1:8000/apartment/api/apartments/', payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Успешно добавлено:', res.data);
      alert('Квартира добавлена!');
    } catch (err) {
      console.error('Ошибка при добавлении квартиры:', err);
      alert('Ошибка при отправке.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2>Добавить квартиру</h2>

      <label>Адрес</label>
      <input type="text" name="address" value={formData.address} onChange={handleChange} required />

      <label>Цена</label>
      <input type="number" name="price" value={formData.price} onChange={handleChange} required />

      <label>Этаж</label>
      <input type="number" name="floor" value={formData.floor} onChange={handleChange} required />

      <label>Фото</label>
      <input type="file" name="image" accept="image/*" onChange={handleChange} />

      <button type="submit">Добавить</button>
    </form>
  );
};

export default AddListingForm;
