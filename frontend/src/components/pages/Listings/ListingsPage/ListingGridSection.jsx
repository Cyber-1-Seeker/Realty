import styles from './ListingGridSection.module.css';

const ListingGridSection = ({ listings, startIndex }) => {
  const API_URL = 'http://127.0.0.1:8000';
  const visibleListings = listings.slice(startIndex, startIndex + 6);

  return (
    <div className={styles.container}>
      <div className={styles.list}>
        {visibleListings.map((listing) => (
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
  );
};

export default ListingGridSection;
