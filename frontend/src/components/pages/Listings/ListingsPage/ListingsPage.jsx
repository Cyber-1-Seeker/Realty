import { useEffect, useState } from 'react';
import axios from 'axios';
import Hero from './ListingsHero.jsx';
import styles from './ListingsPage.module.css';

import backgroundImage from '@/assets/Listings/Hero2.jpg';
import ListingGridSection from "@/components/pages/Listings/ListingsPage/ListingGridSection.jsx";
import ModalForm from "@/components/pages/Listings/ListingsPage/ModalForm.jsx";
import AddListingForm from "@/components/pages/Listings/ListingsPage/AddListingForm.jsx";
import UrgentSellForm from "@/components/pages/Listings/ListingsPage/UrgentSellForm.jsx";

const ListingsPage = () => {
  const [listings, setListings] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showUrgentForm, setShowUrgentForm] = useState(false);

  const API_URL = 'http://127.0.0.1:8000';
  const CHUNK_SIZE = 12;

  useEffect(() => {
    axios
      .get(`${API_URL}/apartment/api/apartments/`)
      .then((res) => setListings(res.data))
      .catch((err) => console.error(err));
  }, []);

  const remainingListings = listings.slice(0, visibleCount);
  const hasMore = listings.length > visibleCount;

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + CHUNK_SIZE);
  };

  return (
    <div>
      <Hero
        title="Доступные квартиры"
        subtitle="Найдите идеальное жилье для себя"
        backgroundImage={backgroundImage}
        onAddClick={() => setShowAddForm(true)}
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
        <AddListingForm onClose={() => setShowAddForm(false)} />
      </ModalForm>

      <ModalForm isOpen={showUrgentForm} onClose={() => setShowUrgentForm(false)}>
        <UrgentSellForm onClose={() => setShowUrgentForm(false)} />
      </ModalForm>
    </div>
  );
};

export default ListingsPage;
