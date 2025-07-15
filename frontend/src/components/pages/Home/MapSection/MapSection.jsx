import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion'; // 👈 добавить импорт
import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps';
import styles from './MapSection.module.css';

const isMobileDevice = () => {
  if (typeof navigator === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

const MapSection = () => {
  const coordinates = [55.751817, 37.599292];
  const [isMapInteractive, setIsMapInteractive] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Проверяем user agent на мобильное устройство
    const checkMobile = () => setIsMobile(isMobileDevice());
    checkMobile();
    // Можно добавить resize, если нужно, но user agent важнее
  }, []);

  // Для мобильных: интерактивность по кнопке, для десктопа всегда интерактивна
  const mapBehaviors = isMobile ? (isMapInteractive ? ['default'] : []) : ['default'];

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

      <div className={styles.mapContainer} style={{ position: 'relative' }}>
        <YMaps>
          <Map
            defaultState={{ center: coordinates, zoom: 16 }}
            width="100%"
            height="400px"
            modules={['geoObject.addon.balloon', 'geoObject.addon.hint']}
            options={{ behaviors: mapBehaviors }}
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
        {isMobile && !isMapInteractive && (
          <button
            className={styles.activateMapBtn}
            onClick={() => setIsMapInteractive(true)}
            style={{
              position: 'absolute',
              bottom: 16,
              right: 16,
              zIndex: 2,
              padding: '10px 18px',
              borderRadius: '8px',
              background: '#fff',
              border: '1px solid #1e3a8a',
              color: '#1e3a8a',
              fontWeight: 600,
              boxShadow: '0 2px 8px rgba(30,58,138,0.08)',
              cursor: 'pointer',
              opacity: 0.95,
              transition: 'background 0.2s',
            }}
          >
            Активировать карту
          </button>
        )}
        {isMobile && isMapInteractive && (
          <button
            className={styles.activateMapBtn}
            onClick={() => setIsMapInteractive(false)}
            style={{
              position: 'absolute',
              bottom: 16,
              right: 16,
              zIndex: 2,
              padding: '10px 18px',
              borderRadius: '8px',
              background: '#fff',
              border: '1px solid #1e3a8a',
              color: '#1e3a8a',
              fontWeight: 600,
              boxShadow: '0 2px 8px rgba(30,58,138,0.08)',
              cursor: 'pointer',
              opacity: 0.95,
              transition: 'background 0.2s',
            }}
          >
            Заблокировать карту
          </button>
        )}
      </div>
    </motion.section>
  );
};

export default MapSection;
