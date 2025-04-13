import React from 'react'
import {YMaps, Map, Placemark} from 'react-yandex-maps'
import styles from './MapSection.module.css'

const MapSection = () => {
    const coordinates = [55.752004, 37.592645] // ул. Арбат, 1

    return (
        <section className={styles.mapSection}>
            <div className={styles.contactBox}>
                <h3>Наши контакты</h3>
                <p><strong>Телефон:</strong> <a href="tel:+79999999999">+7 (999) 999 99-99</a></p>
                <p><strong>Email:</strong> <a href="mailto:info@realty.ru">info@realty.ru</a></p>
                <p><strong>Адрес:</strong> Москва, ул. Арбат, 1</p>
                <p><strong>Telegram:</strong> <a href="https://t.me/youruser">@youruser</a></p>
            </div>

            <div className={styles.mapContainer}>
                <YMaps>
                    <Map
                        defaultState={{center: coordinates, zoom: 16}}
                        className={styles.map}
                        options={{zoomControl: true}}
                    >
                        <Placemark
                            geometry={[55.752004, 37.592645]}
                            properties={{
                                balloonContent: 'Москва, ул. Арбат, д. 1',
                                hintContent: 'Realty – наш офис',
                            }}
                            options={{
                                iconLayout: 'default#image',
                                iconImageHref: 'https://img.icons8.com/color/48/marker.png',
                                iconImageSize: [40, 40],
                                iconImageOffset: [-20, -40]
                            }}
                        />
                    </Map>
                </YMaps>
            </div>
        </section>
    )
}

export default MapSection
