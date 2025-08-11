import {useEffect, useState} from 'react';
import axios from 'axios';
import Hero from './ListingsHero.jsx';
import styles from './ListingsPage.module.css';
import { useTheme } from '@/context/ThemeContext';

import backgroundImage from '@/assets/Listings/Hero2.jpg';
import ListingGridSection from "@/components/pages/Listings/ListingsPage/ListingGridSection.jsx";
import ModalForm from "@/components/pages/Listings/ListingsPage/ModalForm.jsx";
import AddListingForm from "@/components/pages/Listings/ListingsPage/AddListingForm.jsx";
import UrgentSellForm from "@/components/pages/Listings/ListingsPage/UrgentSellForm.jsx";
import AuthModal from '@/components/AuthModal/AuthModal.jsx';
import useAuthGuard from '@/hooks/useAuthGuard';
import { API_URL } from '@/utils/config';

const ListingsPage = ({isAuthenticated, currentUser}) => { // Добавляем currentUser в пропсы
    const { theme } = useTheme();
    const [listings, setListings] = useState([]);
    // const [visibleCount, setVisibleCount] = useState(6); // Отключаем пагинацию
    const [showAddForm, setShowAddForm] = useState(false);
    const [showUrgentForm, setShowUrgentForm] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    // const CHUNK_SIZE = 12;

    useEffect(() => {
        fetchListings();
    }, []);

    const fetchListings = () => {
        axios
            .get(`${API_URL}/api/apartment/apartments/`)
            .then((res) => setListings(res.data))
            .catch((err) => console.error('Ошибка загрузки квартир:', err));
    };

    const guard = useAuthGuard(isAuthenticated, () => setShowAuthModal(true));

    // const remainingListings = listings.slice(0, visibleCount);
    // const hasMore = listings.length > visibleCount;
    // const handleShowMore = () => { ... } // Отключаем функцию

    const handleAddSuccess = () => {
        setShowAddForm(false); // Просто закрываем форму
    };

    return (
        <div className={theme === 'dark' ? styles.dark : ''}>
            <Hero
                title="Доступные квартиры"
                subtitle="Найдите идеальное жилье для себя"
                backgroundImage={backgroundImage}
                onAddClick={guard(() => setShowAddForm(true))}
                onUrgentClick={() => setShowUrgentForm(true)}
            />

            <div className={styles.container}>
                <ListingGridSection listings={listings}/>

                {/*
                {hasMore && (
                    <div className={styles.showMoreWrapper}>
                        <button className={styles.showMoreButton} onClick={handleShowMore}>
                            Показать ещё
                        </button>
                    </div>
                )}
                */}
            </div>

            {/* Модалки */}
            <ModalForm isOpen={showAddForm} onClose={() => setShowAddForm(false)}>
                <AddListingForm
                    onClose={() => setShowAddForm(false)}
                    user={currentUser}
                />
            </ModalForm>

            <ModalForm isOpen={showUrgentForm} onClose={() => setShowUrgentForm(false)}>
                <UrgentSellForm onClose={() => setShowUrgentForm(false)}/>
            </ModalForm>

            {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)}/>}
        </div>
    );
};

export default ListingsPage;