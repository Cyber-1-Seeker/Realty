import { useEffect, useState } from 'react';
import axios from 'axios';
import Hero from './ListingsHero.jsx';
import styles from './ListingsPage.module.css';

import backgroundImage from '@/assets/Listings/Hero2.jpg';
import ListingGridSection from "@/components/pages/Listings/ListingsPage/ListingGridSection.jsx";
import ModalForm from "@/components/pages/Listings/ListingsPage/ModalForm.jsx";
import AddListingForm from "@/components/pages/Listings/ListingsPage/AddListingForm.jsx";
import UrgentSellForm from "@/components/pages/Listings/ListingsPage/UrgentSellForm.jsx";
import AuthModal from '@/components/AuthModal/AuthModal.jsx';
import useAuthGuard from '@/hooks/useAuthGuard';

const ListingsPage = ({ isAuthenticated, currentUser }) => { // Добавляем currentUser в пропсы
  const [listings, setListings] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showUrgentForm, setShowUrgentForm] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  console.log("Текущий пользователь это", {currentUser})
  const API_URL = 'http://127.0.0.1:8000';
  const CHUNK_SIZE = 12;

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = () => {
    axios
      .get(`${API_URL}/api/apartment/apartments/`)
      .then((res) => setListings(res.data))
      .catch((err) => console.error(err));
  };

  const guard = useAuthGuard(isAuthenticated, () => setShowAuthModal(true));

  const remainingListings = listings.slice(0, visibleCount);
  const hasMore = listings.length > visibleCount;

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + CHUNK_SIZE);
  };

  const handleAddSuccess = (newListing) => {
    setListings(prev => [newListing, ...prev]); // Добавляем новое объявление в список
    setShowAddForm(false); // Закрываем модальное окно
    message.success('Объявление успешно добавлено!');
  };

  return (
    <div>
      <Hero
        title="Доступные квартиры"
        subtitle="Найдите идеальное жилье для себя"
        backgroundImage={backgroundImage}
        onAddClick={guard(() => setShowAddForm(true))}
        onUrgentClick={() => setShowUrgentForm(true)}
      />

      <div className={styles.container}>
        <ListingGridSection listings={remainingListings} />

        {hasMore && (
          <div className={styles.showMoreWrapper}>
            <button className={styles.showMoreButton} onClick={handleShowMore}>
              Показать ещё
            </button>
          </div>
        )}
      </div>

      {/* Модалки */}
      <ModalForm isOpen={showAddForm} onClose={() => setShowAddForm(false)}>
        <AddListingForm
          onClose={() => setShowAddForm(false)}
          onSuccess={handleAddSuccess}
          user={currentUser} // Передаём текущего пользователя
        />
      </ModalForm>

      <ModalForm isOpen={showUrgentForm} onClose={() => setShowUrgentForm(false)}>
        <UrgentSellForm onClose={() => setShowUrgentForm(false)} />
      </ModalForm>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </div>
  );
};

export default ListingsPage;