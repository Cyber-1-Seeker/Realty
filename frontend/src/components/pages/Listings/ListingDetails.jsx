import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { API_PUBLIC } from '@/utils/api/axiosPublic.js';
import styles from './ListingDetails.module.css';

const ListingDetails = () => {
  const { id } = useParams();
  const [apartment, setApartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const thumbnailTrackRef = useRef(null);

  useEffect(() => {
    const fetchApartment = async () => {
      try {
        const response = await API_PUBLIC.get(`/api/apartment/apartments/${id}/`);
        setApartment(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to fetch apartment');
        setLoading(false);
      }
    };

    fetchApartment();
  }, [id]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    // Scroll thumbnail into view when currentImageIndex changes
    if (thumbnailTrackRef.current) {
      const thumbnail = thumbnailTrackRef.current.children[currentImageIndex];
      if (thumbnail) {
        thumbnail.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        });
      }
    }
  }, [currentImageIndex]);

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  if (!apartment) {
    return <div className={styles.noApartment}>Apartment not found</div>;
  }

  const images = apartment.images || [];
  const hasImages = images.length > 0;
  const currentImage = hasImages ? images[currentImageIndex].image : null;

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : images.length - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex < images.length - 1 ? prevIndex + 1 : 0));
  };

  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
  };

  const handleImageClick = () => {
    if (hasImages) setIsFullscreen(true);
  };

  return (
      <div className={styles.listingDetailsContainer}>
          <div className={styles.imageSection}>
              <div className={styles.imageCarousel}>
                  <div className={styles.imageContainer}>
                      {hasImages ? (
                          <img
                              src={currentImage}
                              alt={`${apartment.address} - ${currentImageIndex + 1}`}
                              className={styles.apartmentImage}
                              onClick={handleImageClick}
                          />
                      ) : (
                          <div className={styles.imagePlaceholder}>Изображение отсутствует</div>
                      )}
                  </div>

                  {hasImages && images.length > 1 && (
                      <>
                          <button className={styles.navButton} onClick={handlePrevImage}>
                              &lt;
                          </button>
                          <button className={styles.navButton} onClick={handleNextImage}>
                              &gt;
                          </button>
                      </>
                  )}
                  {isFullscreen && (
                      <div className={styles.fullscreenOverlay} onClick={() => setIsFullscreen(false)}>
                          <div className={styles.fullscreenContent} onClick={(e) => e.stopPropagation()}>
                              <button className={styles.fullscreenNavButton} onClick={handlePrevImage}>
                                  &lt;
                              </button>
                              <img
                                  src={currentImage}
                                  alt={`Fullscreen ${currentImageIndex + 1}`}
                                  className={styles.fullscreenImage}
                              />
                              <button className={styles.fullscreenNavButton} onClick={handleNextImage}>
                                  &gt;
                              </button>
                          </div>
                      </div>
                  )}
              </div>

              {/* Thumbnail List */}
              {hasImages && (
                  <div className={styles.thumbnailList} ref={thumbnailTrackRef}>
                      {images.map((image, index) => (
                          <img
                              key={index}
                              src={image.image}
                              alt={`Thumbnail ${index + 1}`}
                              className={`${styles.thumbnail} ${
                                  index === currentImageIndex ? styles.activeThumbnail : ''
                              }`}
                              onClick={() => handleThumbnailClick(index)}
                          />
                      ))}
                  </div>
              )}
          </div>

          <div className={styles.detailsContent}>
              <h1 className={styles.address}>{apartment.address}</h1>
              <p className={styles.price}>Цена: {apartment.price} ₽</p>
              <p className={styles.rooms}>Комнат: {apartment.rooms}</p>
              <p className={styles.floor}>Этаж: {apartment.floor}</p>
              <p className={styles.area}>Площадь: {apartment.area} м²</p>
              <p className={styles.createdAt}>
                  Дата создания: {new Date(apartment.created_at).toLocaleDateString()}
              </p>
              <div className={styles.description}>
                  <h2>Описание</h2>
                  <p>{apartment.description || 'Описание отсутствует'}</p>
              </div>
              <div className={styles.amenities}>
                  <h2>Удобства</h2>
                  <ul>
                      {(apartment.amenities || []).map((amenity, index) => (
                          <li key={index}>{amenity}</li>
                      ))}
                  </ul>
              </div>
          </div>
          <p>ertertret</p>
          <p>ertertret</p>
          <p>ertertret</p>

          <p>ertertret</p>

          <p>ertertret</p>

          <p>ertertret</p>
          <p>ertertret</p>
          <p>ertertret</p>

          <p>ertertret</p>

          <p>ertertret</p>

          <p>ertertret</p>

          <p>ertertret</p>


      </div>
  );
};

export default ListingDetails;