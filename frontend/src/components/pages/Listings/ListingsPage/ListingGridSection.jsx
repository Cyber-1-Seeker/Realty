import {Link} from 'react-router-dom';
import {useEffect, useRef} from 'react';
import styles from './ListingGridSection.module.css';

const ListingGridSection = ({listings}) => {
    const gridRef = useRef(null);

    useEffect(() => {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                }
            });
        }, observerOptions);

        const cards = gridRef.current?.querySelectorAll(`.${styles.card}`);
        cards?.forEach((card) => {
            observer.observe(card);
        });

        return () => {
            cards?.forEach((card) => {
                observer.unobserve(card);
            });
        };
    }, [listings]);

    return (
        <div className={styles.grid} ref={gridRef}>
            {listings.map((listing, index) => (
                <div 
                    key={listing.id} 
                    className={styles.card}
                    style={{
                        animationDelay: `${index * 0.1}s`,
                        animationPlayState: 'paused'
                    }}
                >
                    <div className={styles.imageWrapper}>
                        {listing.images && listing.images.length > 0 ? (
                            <img
                                src={listing.images[0].image}
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
