import styles from './OwnerListingBlock.module.css';
import ownerBg from '@/assets/listings/owner-bg.jpg';
import { Link } from 'react-router-dom';

const OwnerListingBlock = () => {
    return (
        <section className={styles.block} style={{backgroundImage: `url(${ownerBg})`}}>
            <div className={styles.overlay}>
                <h2>Хотите продать свою квартиру?</h2>
                <p>
                    Разместите объявление в нашей базе — и получите заинтересованных покупателей уже в ближайшие дни.
                    Это бесплатно и займёт всего пару минут.
                </p>
                <Link to="/listings/add" className={styles.button}>
                    Разместить квартиру
                </Link></div>
        </section>
    );
};

export default OwnerListingBlock;
