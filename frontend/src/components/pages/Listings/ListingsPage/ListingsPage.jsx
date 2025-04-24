import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../../../Navbar/Navbar.jsx';
import Hero from './ListingsHero.jsx';
import styles from './ListingsPage.module.css';

import backgroundImage from '@/assets/Listings/Hero2.jpg';


import ListingGridSection from "@/components/pages/Listings/ListingsPage/ListingGridSection.jsx";
import OwnerListingBlock from "@/components/pages/Listings/ListingsPage/OwnerListingBlock.jsx";
import UrgentSellBlock from "@/components/pages/Listings/ListingsPage/UrgentSellBlock.jsx";


const ListingsPage = () => {
  const [listings, setListings] = useState([]);
  const API_URL = 'http://127.0.0.1:8000';

  useEffect(() => {
    axios
      .get(`${API_URL}/apartment/api/apartments/`)
      .then((res) => setListings(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <Navbar />
      <Hero
        title="Доступные квартиры"
        subtitle="Найдите идеальное жилье для себя"
        backgroundImage={backgroundImage}
      />

     <ListingGridSection listings={listings} startIndex={0}/>

     <OwnerListingBlock/>

    <ListingGridSection listings={listings} startIndex={0} />

    <UrgentSellBlock/>

      <div className={styles.container}>
        <div className={styles.list}>
          {listings.map((listing) => (
              <div key={listing.id} className={styles.card}>
                  <div className={styles.imageWrapper}>
                      {listing.image ? (
                          <img
                              src={`${API_URL}${listing.image}`}
                              alt={listing.address}
                              className={styles.image}
                          />
                      ) : (
                          <div className={styles.imagePlaceholder}>Нет фото</div>
                      )}
                  </div>

                  <div className={styles.content}>
                      <h2 className={styles.address}>{listing.address}</h2>
                      <p className={styles.price}>Цена: {listing.price} ₽</p>
                      <p className={styles.floor}>Этаж: {listing.floor}</p>
                      <button className={styles.button}>Подробнее</button>
                  </div>
              </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListingsPage;
