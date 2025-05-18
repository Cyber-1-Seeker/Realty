import {Link} from 'react-router-dom';
import styles from './ListingGridSection.module.css';


const ListingGridSection = ({listings}) => {
    return (
        <div className={styles.grid}>
            {listings.map((listing) => (
                <div key={listing.id} className={styles.card}>
                    <div className={styles.imageWrapper}>
                        {listing.images && listing.images.length > 0 ? (
                            <img
                                src={`http://127.0.0.1:8000${listing.images[0].image}`}
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
                        <Link to={`/listings/${listing.id}`} className={styles.button}>Подробнее</Link>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ListingGridSection;
