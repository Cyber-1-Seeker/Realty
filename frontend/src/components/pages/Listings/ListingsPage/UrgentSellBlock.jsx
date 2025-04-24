import styles from './UrgentSellBlock.module.css';
// import urgentBg from '@/assets/listings/urgent-bg.jpg'; // Замени на своё изображение

const UrgentSellBlock = () => {
  return (
    // <section className={styles.block} style={{ backgroundImage: `url(${urgentBg})` }}>
    <section>
      <div className={styles.overlay}>
        <h2>Нужно срочно продать квартиру?</h2>
        <p>Наши специалисты помогут вам продать квартиру за 1–3 дня. Просто оставьте заявку, и мы свяжемся с вами.</p>
        <form className={styles.form}>
          <input type="text" placeholder="Ваше имя" required />
          <input type="tel" placeholder="Телефон" required />
          <button type="submit">Оставить заявку</button>
        </form>
      </div>
    </section>
  );
};

export default UrgentSellBlock;
