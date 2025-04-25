import React, {useState} from 'react'
import {motion} from 'framer-motion' // 👈 добавить импорт
import styles from './CallToAction.module.css'

const CallToAction = () => {
    const [rooms, setRooms] = useState('')
    const [area, setArea] = useState('')
    const [city, setCity] = useState('')
    const [price, setPrice] = useState(null)

    const handleCalculate = (e) => {
        e.preventDefault()

        if (!rooms || !area || !city) {
            alert('Пожалуйста, заполните все поля')
            return
        }

        const basePrice = 95000
        const multiplier = city.toLowerCase() === 'москва' ? 1.2 : 1
        const total = Math.round(basePrice * area * multiplier)

        setPrice(total)
    }

    return (
        <motion.section
            className={styles.cta}
            id="calculator"
            initial={{opacity: 0, y: 50}}
            whileInView={{opacity: 1, y: 0}}
            transition={{duration: 0.6}}
            viewport={{once: true, amount: 0.2}}
        >
            <h2>Хотите узнать стоимость вашей квартиры?</h2>
            <p>Заполните форму — <strong>и получите стоимость квартиры с точностью до 96%</strong></p>

            <form className={styles.form} onSubmit={handleCalculate}>
                <input type="text" placeholder="Город" value={city} onChange={(e) => setCity(e.target.value)}/>
                <input type="number" placeholder="Количество комнат" value={rooms}
                       onChange={(e) => setRooms(e.target.value)}/>
                <input type="number" placeholder="Площадь (м²)" value={area} onChange={(e) => setArea(e.target.value)}/>
                <input type="text" placeholder="Остальные формы потом" value={city}
                       onChange={(e) => setCity(e.target.value)}/>
                <button type="submit">Рассчитать стоимость</button>
            </form>

            {price && (
                <div className={styles.result}>
                    <p>💰 Оценочная стоимость: <strong>{price.toLocaleString()} ₽</strong></p>
                </div>
            )}
        </motion.section>
    )
}

export default CallToAction
