import { useEffect, useState } from "react";
import axios from 'axios';
import styles from './Listings.module.css';
import { Link } from 'react-router-dom'; // если используешь маршруты

const ListingsPage = () => {
    const [listings, setListings] = useState([]);
    const API_URL = 'http://127.0.0.1:8000';

    useEffect(() => {
        axios.get(`${API_URL}/apartment/api/apartments/`)
            .then(res => setListings(res.data))
            .catch(err => console.error(err))
    }, []);

    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>Доступные квартиры</h1>
            <div className={styles.list}>
                {listings.map(listing => (
                    <div key={listing.id} className={styles.card}>
                        <img src={`${API_URL}${listing.image}`} alt={listing.address} className={styles.image} />
                        <div className={styles.content}>
                            <h2 className={styles.address}>{listing.address}</h2>
                            <p className={styles.price}>Цена: {listing.price} ₽</p>
                            <p className={styles.floor}>Этаж: {listing.floor}</p>
                            <Link to={`/listings/${listing.id}`} className={styles.button}>Подробнее</Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ListingsPage;
