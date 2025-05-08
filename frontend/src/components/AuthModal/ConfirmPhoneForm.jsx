import React, {useState} from 'react';
import styles from './LoginRegisterForm.module.css';
import {API_PUBLIC} from "@/utils/api/axiosPublic.js";

const ConfirmPhoneForm = ({token}) => {
    const [code, setCode] = useState('');
    const [confirmed, setConfirmed] = useState(false);
    const [error, setError] = useState('');

    const handleVerify = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await API_PUBLIC.post('/api/accounts/confirm-code/', {
                token,
                code
            });

            const data = await response.json();
            if (response.ok) {
                setConfirmed(true);
                window.location.reload();
            } else {
                setError(data.error || 'Ошибка подтверждения');
            }
        } catch {
            setError('Сервер недоступен');
        }
    };

    if (confirmed) {
        return <h2 className={styles.title}>Номер подтверждён!</h2>;
    }

    return (
        <form onSubmit={handleVerify} className={styles.authForm}>
            <h2 className={styles.title}>Подтвердите номер</h2>

            <label className={styles.label}>
                Код из SMS:
                <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                    className={styles.input}
                />
            </label>

            {error && <div className={styles.error}>{error}</div>}

            <button type="submit" className={styles.button}>
                Подтвердить
            </button>
        </form>
    );
};

export default ConfirmPhoneForm;
