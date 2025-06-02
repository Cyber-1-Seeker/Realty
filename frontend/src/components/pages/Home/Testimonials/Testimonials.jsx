import React, {useState, useEffect} from 'react';
import styles from './Testimonials.module.css';
import {motion} from "framer-motion";
import {Swiper, SwiperSlide} from 'swiper/react';
import {Navigation, Pagination, Autoplay} from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import {API_AUTH} from '@/utils/api/axiosWithAuth'; // Используем публичный API

const Testimonials = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const res = await API_AUTH.get('/api/testimonials/testimonials/');
                // Фильтруем только активные отзывы
                const activeTestimonials = res.data.filter(item => item.is_active);
                setTestimonials(activeTestimonials);
            } catch (err) {
                setError('Не удалось загрузить отзывы');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchTestimonials();
    }, []);

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
                <p>Загружаем отзывы...</p>
            </div>
        );
    }

    if (error) {
        return <div className={styles.errorContainer}>{error}</div>;
    }

    if (!testimonials.length) {
        return null;
    }

    return (
        <motion.section
            className={styles.testimonials}
            initial={{opacity: 0, y: 50}}
            whileInView={{opacity: 1, y: 0}}
            transition={{duration: 0.6}}
            viewport={{once: true, amount: 0.2}}
        >
            <div className={styles.header}>
                <h2>Отзывы наших клиентов</h2>
                <p>Реальные истории людей, которым мы помогли</p>
            </div>

            <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                navigation
                pagination={{
                    clickable: true,
                    dynamicBullets: true
                }}
                autoplay={{
                    delay: 7000,
                    disableOnInteraction: false,
                }}
                spaceBetween={30}
                slidesPerView={1}
                breakpoints={{
                    640: {slidesPerView: 1},
                    768: {slidesPerView: 2},
                    1024: {slidesPerView: 3},
                }}
                className={styles.swiperContainer}
            >
                {testimonials.map(testimonial => (
                    <SwiperSlide key={testimonial.id}>
                        <div className={styles.item}>
                            <div className={styles.quoteIcon}>“</div>
                            <p className={styles.testimonialText}>“{testimonial.text}”</p>
                            <div className={styles.clientInfo}>
                                <div className={styles.clientName}>{testimonial.name}</div>
                                <div className={styles.clientDate}>
                                    {new Date(testimonial.created_at).toLocaleDateString('ru-RU', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    })}
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </motion.section>
    );
};

export default Testimonials;