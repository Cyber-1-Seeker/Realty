import React from 'react'
import styles from './CallToAction.module.css'
import {Link} from 'react-router-dom'
import {motion} from 'framer-motion';

const CallToAction = () => {
  return (
      <motion.section
          className={styles.cta}
          initial={{opacity: 0, y: 50}}
          whileInView={{opacity: 1, y: 0}}
          transition={{duration: 0.6}}
          viewport={{once: true, amount: 0.2}}
      >
          <h2>Хотите узнать стоимость вашей квартиры?</h2>
          <p>Заполните форму — мы перезвоним в течение 15 минут.</p>
          <Link to="/calculator" className={styles.button}>Перейти к калькулятору</Link>
     </motion.section>
    )
}

export default CallToAction
