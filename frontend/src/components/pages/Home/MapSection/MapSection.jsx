import React from 'react';
import { motion } from 'framer-motion'; // 👈 добавить импорт
import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps';
import styles from './MapSection.module.css';

const MapSection = () => {
  const coordinates = [55.751817, 37.599292];

  return (
    <motion.section
      id="contacts"
      className={styles.mapSection}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true, amount: 0.2 }}
    >
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
            defaultState={{ center: coordinates, zoom: 16 }}
            width="100%"
            height="400px"
            modules={['geoObject.addon.balloon', 'geoObject.addon.hint']}
          >
            <Placemark
              geometry={coordinates}
              properties={{
                balloonContent: 'Москва, ул. Арбат, д. 1',
                hintContent: 'Realty – наш офис',
              }}
              options={{
                iconLayout: 'default#image',
                iconImageHref: 'https://img.icons8.com/color/48/marker.png',
                iconImageSize: [40, 40],
                iconImageOffset: [-20, -40],
              }}
            />
          </Map>
        </YMaps>
      </div>
    </motion.section>
  );
};

export default MapSection;
