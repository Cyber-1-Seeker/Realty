import {useEffect, useMemo, useState} from 'react';
import axios from 'axios';
import Hero from './ListingsHero.jsx';
import styles from './ListingsPage.module.css';
import { useTheme } from '@/context/ThemeContext';

import backgroundImage from '@/assets/Listings/Hero2.jpg';
import ListingGridSection from "@/components/pages/Listings/ListingsPage/ListingGridSection.jsx";
import ListingsFilter from "@/components/pages/Listings/ListingsPage/ListingsFilter.jsx";
import ModalForm from "@/components/pages/Listings/ListingsPage/ModalForm.jsx";
import AddListingForm from "@/components/pages/Listings/ListingsPage/AddListingForm.jsx";
import UrgentSellForm from "@/components/pages/Listings/ListingsPage/UrgentSellForm.jsx";
import AuthModal from '@/components/AuthModal/AuthModal.jsx';
import useAuthGuard from '@/hooks/useAuthGuard';
import { API_URL } from '@/utils/config';

const ListingsPage = ({isAuthenticated, currentUser}) => { // Добавляем currentUser в пропсы
    const { theme } = useTheme();
    const [listings, setListings] = useState([]);
    const [filteredListings, setFilteredListings] = useState([]);
    const [activeFilters, setActiveFilters] = useState({});
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
            .then((res) => {
                
                
                setListings(res.data);
                setFilteredListings(res.data); // Инициализируем отфильтрованный список
            })
            .catch((err) => console.error('Ошибка загрузки квартир:', err));
    };

    // Функция фильтрации квартир
    const applyFilters = (filters) => {
        setActiveFilters(filters);
        
        let filtered = [...listings];
        

        
        // Применяем ВСЕ фильтры одновременно к каждой квартире
        filtered = filtered.filter((listing) => {
            let passesAllFilters = true;
            
            // 1. Фильтр по общей площади
            if (filters.totalAreaFrom != null || filters.totalAreaTo != null) {
                const hasFrom = listing.total_area_from !== null && listing.total_area_from !== undefined;
                const hasTo = listing.total_area_to !== null && listing.total_area_to !== undefined;
                
                if (!hasFrom && !hasTo) {
                    passesAllFilters = false;
                } else {
                    let passesAreaFilter = true;
                    
                    if (filters.totalAreaFrom != null && hasFrom) {
                        const areaFrom = parseFloat(listing.total_area_from);
                        passesAreaFilter = passesAreaFilter && areaFrom >= filters.totalAreaFrom;
                    }
                    
                    if (filters.totalAreaTo != null && hasTo) {
                        const areaTo = parseFloat(listing.total_area_to);
                        passesAreaFilter = passesAreaFilter && areaTo <= filters.totalAreaTo;
                    }
                    
                    if (!passesAreaFilter) {
                        passesAllFilters = false;
                    }
                }
            }
            
            // 2. Фильтр по жилой площади
            if (passesAllFilters && (filters.livingAreaFrom != null || filters.livingAreaTo != null)) {
                const hasFrom = listing.living_area_from !== null && listing.living_area_from !== undefined;
                const hasTo = listing.living_area_to !== null && listing.living_area_to !== undefined;
                
                if (!hasFrom && !hasTo) {
                    passesAllFilters = false;
                } else {
                    let passesLivingAreaFilter = true;
                    
                    if (filters.livingAreaFrom != null && hasFrom) {
                        const areaFrom = parseFloat(listing.living_area_from);
                        passesLivingAreaFilter = passesLivingAreaFilter && areaFrom >= filters.livingAreaFrom;
                    }
                    
                    if (filters.livingAreaTo != null && hasTo) {
                        const areaTo = parseFloat(listing.living_area_to);
                        passesLivingAreaFilter = passesLivingAreaFilter && areaTo <= filters.livingAreaTo;
                    }
                    
                    if (!passesLivingAreaFilter) {
                        passesAllFilters = false;
                    }
                }
            }
            
            // 3. Фильтр по этажу
            if (passesAllFilters && (filters.floorFrom != null || filters.floorTo != null)) {
                const hasFrom = listing.floor_from !== null && listing.floor_from !== undefined;
                const hasTo = listing.floor_to !== null && listing.floor_to !== undefined;
                
                if (!hasFrom && !hasTo) {
                    passesAllFilters = false;
                } else {
                    let passesFloorFilter = true;
                    
                    if (filters.floorFrom != null && hasFrom) {
                        const floorFrom = parseInt(listing.floor_from);
                        passesFloorFilter = passesFloorFilter && floorFrom >= filters.floorFrom;
                    }
                    
                    if (filters.floorTo != null && hasTo) {
                        const floorTo = parseInt(listing.floor_to);
                        passesFloorFilter = passesFloorFilter && floorTo <= filters.floorTo;
                    }
                    
                    if (!passesFloorFilter) {
                        passesAllFilters = false;
                    }
                }
            }
            
            // 4. Фильтр по этажности дома
            if (passesAllFilters && (filters.totalFloorsFrom != null || filters.totalFloorsTo != null)) {
                const hasFrom = listing.total_floors_from !== null && listing.total_floors_from !== undefined;
                const hasTo = listing.total_floors_to !== null && listing.total_floors_to !== undefined;
                
                if (!hasFrom && !hasTo) {
                    passesAllFilters = false;
                } else {
                    let passesTotalFloorsFilter = true;
                    
                    if (filters.totalFloorsFrom != null && hasFrom) {
                        const floorsFrom = parseInt(listing.total_floors_from);
                        passesTotalFloorsFilter = passesTotalFloorsFilter && floorsFrom >= filters.totalFloorsFrom;
                    }
                    
                    if (filters.totalFloorsTo != null && hasTo) {
                        const floorsTo = parseInt(listing.total_floors_to);
                        passesTotalFloorsFilter = passesTotalFloorsFilter && floorsTo <= filters.totalFloorsTo;
                    }
                    
                    if (!passesTotalFloorsFilter) {
                        passesAllFilters = false;
                    }
                }
            }
            
            return passesAllFilters;
        });
        

        
        setFilteredListings(filtered);
    };

    // Очистка фильтров
    const clearFilters = () => {
        setActiveFilters({});
        setFilteredListings(listings);
    };

    const guard = useAuthGuard(isAuthenticated, () => setShowAuthModal(true));

    // const remainingListings = listings.slice(0, visibleCount);
    // const hasMore = listings.length > visibleCount;
    // const handleShowMore = () => { ... } // Отключаем функцию

    const handleAddSuccess = () => {
        setShowAddForm(false); // Просто закрываем форму
    };

    // Открываем нужную модалку по хэшу/поиску
    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (window.location.hash === '#add') {
                setShowAddForm(true);
            }
            if (window.location.hash === '#listings') {
                const el = document.getElementById('listings-root');
                if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                }
            }
        }
    }, []);

    return (
        <div className={theme === 'dark' ? styles.dark : ''}>
            <Hero
                title="Доступные квартиры"
                subtitle="Найдите идеальное жилье для себя"
                backgroundImage={backgroundImage}
                onAddClick={guard(() => setShowAddForm(true))}
                onUrgentClick={() => setShowUrgentForm(true)}
            />

            <div className={styles.container} id="listings-root">
                <ListingsFilter 
                    onFilterChange={applyFilters}
                    onClearFilters={clearFilters}
                    totalCount={listings.length}
                    filteredCount={filteredListings.length}
                    activeFilters={activeFilters}
                />
                
                <ListingGridSection listings={filteredListings}/>

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