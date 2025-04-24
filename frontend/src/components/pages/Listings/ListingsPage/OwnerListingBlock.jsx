import styles from './OwnerListingBlock.module.css';
import ownerBg from '@/assets/listings/owner-bg.jpg'; // поменяй на своё изображение

const OwnerListingBlock = () => {
  return (
      <section className={styles.block}  style={{ backgroundImage: `url(${ownerBg})` }}>
      <div className={styles.overlay}>
        <h2>Хотите продать свою квартиру?</h2>
        <p>
          Разместите объявление в нашей базе — и получите заинтересованных покупателей уже в ближайшие дни. Это бесплатно и займёт всего пару минут.
        </p>
        <button className={styles.button}>Разместить квартиру</button>
      </div>
      </section>
  );
};

export default OwnerListingBlock;
