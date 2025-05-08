import {useState} from 'react';
import styles from './AddListingForm.module.css';
import {getCSRFTokenFromCookie} from '@/utils/api/csrf.js';
import {API_AUTH} from "@/utils/api/axiosWithAuth.js";
// const AddListingForm = () => {
//     return (
//         <div className={styles.form}>
//             <h2>Разместить квартиру</h2>
//             <p style={{fontSize: '1.1rem', color: 'gray', marginTop: '1rem'}}>
//                 🛠 Эта функция временно недоступна. Мы уже работаем над ней!
//             </p>
//         </div>
//     );
// }

// Пока в разработке и не работает ни черта

const AddListingForm = ({onClose}) => {
    const [formData, setFormData] = useState({
        address: '',
        price: '',
        floor: '',
        rooms: '',
        area: '',
        image: null,
    });

    const handleChange = (e) => {
        const {name, value, files} = e.target;
        setFormData({
            ...formData,
            [name]: files ? files[0] : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const form = e.target;
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const payload = new FormData();
        for (let key in formData) {
            payload.append(key, formData[key]);
        }

        try {
            const csrfToken = getCSRFTokenFromCookie();
            const res = await API_AUTH.post('/api/apartment/apartments/', payload, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            alert('Квартира успешно добавлена!');
            onClose();
        } catch (err) {
            console.error(err);
            alert('Ошибка при добавлении квартиры.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <h2>Разместить квартиру</h2>

            <input
                type="text"
                name="address"
                placeholder="Адрес квартиры"
                value={formData.address}
                onChange={handleChange}
                required
                pattern=".{5,}" // минимум 5 символов
                title="Адрес должен содержать минимум 5 символов"
            />

            <input
                type="number"
                name="price"
                placeholder="Цена (₽)"
                value={formData.price}
                onChange={handleChange}
                required
                min="1"
                max="99999999" // 8 цифр максимум
                step="1"
                title="Введите сумму до 99 999 999 ₽"
            />

            <input
                type="number"
                name="floor"
                placeholder="Этаж"
                value={formData.floor}
                onChange={handleChange}
                required
                min="0"
                step="1"
                title="Введите неотрицательное целое число"
            />

            <input
                type="number"
                name="rooms"
                placeholder="Количество комнат"
                value={formData.rooms}
                onChange={handleChange}
                required
                min="1"
                step="1"
                title="Введите положительное целое число"
            />

            <input
                type="number"
                name="area"
                placeholder="Площадь (м²)"
                value={formData.area}
                onChange={handleChange}
                required
                min="1"
                step="0.01"
                max="999.99" // ✅ максимум 999.99
                title="Введите число до 999.99 м²"
            />

            <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
            />

            <button type="submit">Добавить квартиру</button>
        </form>

    );
};

export default AddListingForm;
