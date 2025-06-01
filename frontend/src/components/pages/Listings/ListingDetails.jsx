import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {API_PUBLIC} from '@/utils/api/axiosPublic.js';
import {
    HomeOutlined,
    BankOutlined,
    BuildOutlined,
    EnvironmentOutlined,
    ApartmentOutlined,
    SettingOutlined,
    EyeOutlined,
    CalendarOutlined,
    DollarOutlined,
    InfoCircleOutlined,
    PhoneOutlined,
    MailOutlined,
    UserOutlined,
    CameraOutlined,
    FileTextOutlined,
    LoadingOutlined,
    LeftOutlined,
    RightOutlined,
    FullscreenExitOutlined,
    FullscreenOutlined,
    MessageOutlined,
    CommentOutlined
} from '@ant-design/icons';
import {Image, Tag, Button, Divider, Card, Row, Col, Skeleton, Empty, Modal} from 'antd';
import styles from './ListingDetails.module.css';

const ListingDetails = () => {
    const {id} = useParams();
    const [apartment, setApartment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);

    useEffect(() => {
        const fetchApartment = async () => {
            try {
                setLoading(true);
                const response = await API_PUBLIC.get(`/api/apartment/apartments/${id}/`);
                setApartment(response.data);
            } catch (err) {
                setError(err.message || 'Не удалось загрузить данные квартиры');
            } finally {
                setLoading(false);
            }
        };

        fetchApartment();
    }, [id]);

    // Функции для форматирования значений
    const propertyTypeMap = {
        apartment: 'Квартира',
        apartments: 'Апартаменты',
        studio: 'Студия',
        house: 'Дом',
        townhouse: 'Таунхаус'
    };

    const bathroomTypeMap = {
        separate: 'Раздельный',
        combined: 'Совмещенный',
        multiple: 'Несколько санузлов'
    };

    const renovationTypeMap = {
        rough: 'Черновая',
        clean: 'Чистовая',
        euro: 'Евроремонт',
        design: 'Дизайнерский',
        partial: 'Частичный ремонт'
    };

    const viewTypeMap = {
        yard: 'Двор',
        street: 'Улица',
        park: 'Парк',
        river: 'Река',
        city: 'Вид на город'
    };

    const dealTypeMap = {
        sale: 'Продажа',
        rent: 'Аренда',
        rent_daily: 'Посуточная аренда'
    };

    const getTagColor = (type) => {
        const colors = {
            sale: '#52c41a',
            rent: '#1890ff',
            rent_daily: '#722ed1'
        };
        return colors[type] || 'default';
    };

    const renderValue = (value, unit = '') => {
        if (value === null || value === undefined || value === '') return '—';
        return `${value}${unit}`;
    };

    const renderArea = (value) => {
        if (!value) return '—';
        return `${parseFloat(value).toFixed(1)} м²`;
    };

    const renderPrice = (value) => {
        if (!value) return '—';
        return `${parseFloat(value).toLocaleString('ru-RU')} ₽`;
    };

    // Навигация по изображениям
    const goToPrevImage = (e) => {
        e.stopPropagation();
        if (!apartment.images || apartment.images.length === 0) return;
        setCurrentImageIndex(prevIndex =>
            prevIndex === 0 ? apartment.images.length - 1 : prevIndex - 1
        );
    };

    const goToNextImage = (e) => {
        e.stopPropagation();
        if (!apartment.images || apartment.images.length === 0) return;
        setCurrentImageIndex(prevIndex =>
            prevIndex === apartment.images.length - 1 ? 0 : prevIndex + 1
        );
    };

    const openFullscreenGallery = (index) => {
        setCurrentImageIndex(index);
        setIsGalleryOpen(true);
    };

    const closeFullscreenGallery = () => {
        setIsGalleryOpen(false);
    };

    // Компонент для отображения карточек с информацией
    const InfoCard = ({icon, label, value, colSpan = 6}) => (
        <Col xs={24} sm={12} md={8} lg={colSpan}>
            <Card className={styles.statCard}>
                <div className={styles.statContent}>
                    <div className={styles.statIcon}>{icon}</div>
                    <div className={styles.statText}>
                        <div className={styles.statLabel}>{label}</div>
                        <div className={styles.statValue}>{value}</div>
                    </div>
                </div>
            </Card>
        </Col>
    );

    // Компонент для деталей объекта
    const DetailItem = ({icon, label, value}) => (
        value && (
            <div className={styles.detailItem}>
                <div className={styles.detailIcon}>{icon}</div>
                <div className={styles.detailContent}>
                    <div className={styles.detailLabel}>{label}</div>
                    <div className={styles.detailValue}>{value}</div>
                </div>
            </div>
        )
    );

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <Skeleton active paragraph={{rows: 10}}/>
                <div className={styles.loadingSpin}>
                    <LoadingOutlined style={{fontSize: 48}}/>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.errorContainer}>
                <div className={styles.errorIcon}>⚠️</div>
                <h2>Ошибка загрузки</h2>
                <p>{error}</p>
                <Button type="primary" onClick={() => window.location.reload()}>
                    Попробовать снова
                </Button>
            </div>
        );
    }

    if (!apartment) {
        return (
            <div className={styles.noDataContainer}>
                <Empty
                    description="Объект недвижимости не найден"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
                <Button type="primary" onClick={() => window.history.back()}>
                    Вернуться назад
                </Button>
            </div>
        );
    }

    return (
        <div className={styles.pageContainer}>
            <div className={styles.container}>
                {/* Заголовок и цена */}
                <div className={styles.header}>
                    <h1 className={styles.title}>{apartment.title || 'Без названия'}</h1>

                    <div className={styles.priceContainer}>
                        <span className={styles.price}>
                            {apartment.price ? `${parseFloat(apartment.price).toLocaleString('ru-RU')} ₽` : 'Цена не указана'}
                        </span>
                        {apartment.deal_type && (
                            <Tag
                                color={getTagColor(apartment.deal_type)}
                                className={styles.dealTag}
                            >
                                {dealTypeMap[apartment.deal_type] || apartment.deal_type}
                            </Tag>
                        )}
                        {apartment.bargain && (
                            <Tag color="#faad14" className={styles.bargainTag}>
                                Возможен торг
                            </Tag>
                        )}
                    </div>

                    <div className={styles.address}>
                        <EnvironmentOutlined/>
                        {apartment.address || 'Адрес не указан'}
                    </div>
                </div>

                {/* Галерея изображений */}
                {apartment.images && apartment.images.length > 0 ? (
                    <div className={styles.gallerySection}>
                        <div
                            className={styles.mainImageContainer}
                            onClick={() => openFullscreenGallery(currentImageIndex)}
                        >
                            <Image
                                src={apartment.images[currentImageIndex].image}
                                alt={`Фото объекта ${currentImageIndex + 1}`}
                                className={styles.mainImage}
                                preview={false}
                            />

                            {/* Стрелки навигации */}
                            <div className={styles.navArrows}>
                                <Button
                                    shape="circle"
                                    icon={<LeftOutlined/>}
                                    className={styles.navArrow}
                                    onClick={goToPrevImage}
                                />
                                <Button
                                    shape="circle"
                                    icon={<RightOutlined/>}
                                    className={styles.navArrow}
                                    onClick={goToNextImage}
                                />
                            </div>

                            {/* Кнопка полноэкранного режима */}
                            <div className={styles.fullscreenButton}
                                 onClick={() => openFullscreenGallery(currentImageIndex)}>
                                <FullscreenOutlined/>
                            </div>
                        </div>

                        <div className={styles.thumbnailsContainer}>
                            {apartment.images.map((image, index) => (
                                <div
                                    key={index}
                                    className={`${styles.thumbnail} ${index === currentImageIndex ? styles.activeThumbnail : ''}`}
                                    onClick={() => setCurrentImageIndex(index)}
                                >
                                    <img
                                        src={image.image}
                                        alt={`Миниатюра ${index + 1}`}
                                        loading="lazy"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className={styles.noImagesPlaceholder}>
                        <div className={styles.noImagesIcon}>
                            <CameraOutlined style={{fontSize: '48px', color: '#bfbfbf'}}/>
                        </div>
                        <div className={styles.noImagesText}>Изображения отсутствуют</div>
                    </div>
                )}

                {/* Основная информация */}
                <div className={styles.detailsSection}>
                    <h2 className={styles.sectionTitle}>
                        <ApartmentOutlined className={styles.sectionIcon}/>
                        Основные характеристики
                    </h2>

                    <Row gutter={[16, 16]} className={styles.statsGrid}>
                        <InfoCard
                            icon={<BankOutlined/>}
                            label="Общая площадь"
                            value={renderArea(apartment.total_area)}
                        />

                        <InfoCard
                            icon={<HomeOutlined/>}
                            label="Комнат"
                            value={renderValue(apartment.rooms)}
                        />

                        {apartment.floor && apartment.total_floors && (
                            <InfoCard
                                icon={<BuildOutlined/>}
                                label="Этаж"
                                value={`${apartment.floor}/${apartment.total_floors}`}
                            />
                        )}

                        <InfoCard
                            icon={<ApartmentOutlined/>}
                            label="Тип недвижимости"
                            value={propertyTypeMap[apartment.property_type] || apartment.property_type}
                        />
                    </Row>
                </div>

                {/* Детальные характеристики */}
                <div className={styles.detailsSection}>
                    <h2 className={styles.sectionTitle}>
                        <SettingOutlined className={styles.sectionIcon}/>
                        Детали объекта
                    </h2>

                    <div className={styles.detailsGrid}>
                        {/* Группировка по категориям */}
                        <div className={styles.detailsGroup}>
                            <h3 className={styles.detailsSubtitle}>Планировка</h3>
                            <DetailItem
                                icon={<ApartmentOutlined/>}
                                label="Тип недвижимости"
                                value={propertyTypeMap[apartment.property_type] || apartment.property_type}
                            />
                            <DetailItem
                                icon={<HomeOutlined/>}
                                label="Комнат"
                                value={renderValue(apartment.rooms)}
                            />
                            <DetailItem
                                icon={<BankOutlined/>}
                                label="Общая площадь"
                                value={renderArea(apartment.total_area)}
                            />
                            <DetailItem
                                icon={<BankOutlined/>}
                                label="Жилая площадь"
                                value={renderArea(apartment.living_area)}
                            />
                            <DetailItem
                                icon={<BankOutlined/>}
                                label="Площадь кухни"
                                value={renderArea(apartment.kitchen_area)}
                            />
                        </div>

                        <div className={styles.detailsGroup}>
                            <h3 className={styles.detailsSubtitle}>Особенности</h3>
                            <DetailItem
                                icon={<SettingOutlined/>}
                                label="Санузел"
                                value={bathroomTypeMap[apartment.bathroom_type] || apartment.bathroom_type}
                            />
                            <DetailItem
                                icon={<BuildOutlined/>}
                                label="Ремонт"
                                value={renovationTypeMap[apartment.renovation] || apartment.renovation}
                            />
                            <DetailItem
                                icon={<EyeOutlined/>}
                                label="Вид из окна"
                                value={viewTypeMap[apartment.view] || apartment.view}
                            />
                            <DetailItem
                                icon={<InfoCircleOutlined/>}
                                label="Балкон/лоджия"
                                value={apartment.balcony ? `${apartment.balcony} шт.` : 'Нет'}
                            />
                        </div>

                        <div className={styles.detailsGroup}>
                            <h3 className={styles.detailsSubtitle}>Дом и окружение</h3>
                            <DetailItem
                                icon={<BuildOutlined/>}
                                label="Этаж"
                                value={apartment.floor && apartment.total_floors
                                    ? `${apartment.floor}/${apartment.total_floors}`
                                    : '—'}
                            />
                            <DetailItem
                                icon={<CalendarOutlined/>}
                                label="Год постройки"
                                value={renderValue(apartment.construction_year)}
                            />
                            <DetailItem
                                icon={<CalendarOutlined/>}
                                label="Год ремонта"
                                value={renderValue(apartment.last_renovation_year)}
                            />
                            {/*<DetailItem*/}
                            {/*    icon={<EnvironmentOutlined/>}*/}
                            {/*    label="Район"*/}
                            {/*    value={apartment.district || 'Не указан'}*/}
                            {/*/>*/}
                        </div>
                    </div>
                </div>

                {/* Информация о цене */}
                <div className={styles.detailsSection}>
                    <h2 className={styles.sectionTitle}>
                        <DollarOutlined className={styles.sectionIcon}/>
                        Финансовые условия
                    </h2>

                    <div className={styles.priceDetails}>
                        <div className={styles.priceItem}>
                            <DollarOutlined className={styles.priceIcon}/>
                            <div>
                                <div className={styles.priceLabel}>Цена</div>
                                <div className={styles.priceValue}>
                                    {renderPrice(apartment.price)}
                                    {apartment.deal_type === 'rent' &&
                                        <span className={styles.pricePeriod}> / месяц</span>}
                                    {apartment.deal_type === 'rent_daily' &&
                                        <span className={styles.pricePeriod}> / сутки</span>}
                                </div>
                                {apartment.bargain && (
                                    <div className={styles.bargainNote}>
                                        <Tag color="gold">Возможен торг</Tag>
                                    </div>
                                )}
                            </div>
                        </div>

                        {apartment.deposit && (apartment.deal_type === 'rent' || apartment.deal_type === 'rent_daily') && (
                            <div className={styles.priceItem}>
                                <DollarOutlined className={styles.priceIcon}/>
                                <div>
                                    <div className={styles.priceLabel}>Залог</div>
                                    <div className={styles.priceValue}>{renderPrice(apartment.deposit)}</div>
                                </div>
                            </div>
                        )}

                        {apartment.utilities && (
                            <div className={styles.priceItem}>
                                <DollarOutlined className={styles.priceIcon}/>
                                <div>
                                    <div className={styles.priceLabel}>Коммунальные платежи</div>
                                    <div className={styles.priceValue}>
                                        {apartment.utilities.includes('₽')
                                            ? apartment.utilities
                                            : `${apartment.utilities} ₽`}
                                    </div>
                                </div>
                            </div>
                        )}

                        {apartment.commission && (
                            <div className={styles.priceItem}>
                                <DollarOutlined className={styles.priceIcon}/>
                                <div>
                                    <div className={styles.priceLabel}>Комиссия</div>
                                    <div className={styles.priceValue}>
                                        {apartment.commission.includes('%')
                                            ? apartment.commission
                                            : `${apartment.commission} ₽`}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {apartment.payment_options && (
                        <div className={styles.paymentOptions}>
                            <h3 className={styles.subsectionTitle}>Варианты оплаты</h3>
                            <div className={styles.paymentTags}>
                                {apartment.payment_options.split(',').map((option, index) => (
                                    <Tag key={index} className={styles.paymentTag}>
                                        {option.trim()}
                                    </Tag>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Описание и особенности */}
                <div className={styles.detailsSection}>
                    <h2 className={styles.sectionTitle}>
                        <FileTextOutlined className={styles.sectionIcon}/>
                        Описание
                    </h2>

                    <div className={styles.description}>
                        {apartment.description || (
                            <div className={styles.noDescription}>Описание отсутствует</div>
                        )}
                    </div>

                    {apartment.features && (
                        <>
                            <h3 className={styles.subsectionTitle}>Особенности</h3>
                            <div className={styles.featuresList}>
                                {apartment.features.split(',').map((feature, index) => (
                                    feature.trim() && (
                                        <Tag key={index} className={styles.featureTag}>
                                            {feature.trim()}
                                        </Tag>
                                    )
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* Контакты владельца */}
                {apartment.owner && (
                    <div className={styles.detailsSection}>
                        <h2 className={styles.sectionTitle}>
                            <UserOutlined className={styles.sectionIcon}/>
                            Контактная информация
                        </h2>

                        <Card className={styles.ownerCard}>
                            <div className={styles.ownerHeader}>
                                <div className={styles.ownerIcon}>
                                    <UserOutlined/>
                                </div>
                                <div>
                                    <div className={styles.ownerName}>
                                        {apartment.owner.name || 'Не указано'}
                                    </div>
                                    <div className={styles.ownerRole}>
                                        Владелец недвижимости
                                    </div>
                                </div>
                            </div>

                            <Divider className={styles.ownerDivider}/>

                            <div className={styles.contactInfo}>
                                {apartment.owner.phone && (
                                    <div className={styles.contactItem}>
                                        <PhoneOutlined className={styles.contactIcon}/>
                                        <div className={styles.contactValue}>
                                            <a
                                                href={`tel:${apartment.owner.phone.replace(/[^0-9+]/g, '')}`}
                                                className={styles.contactLink}
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                {apartment.owner.phone}
                                            </a>
                                        </div>
                                    </div>
                                )}

                                {apartment.owner.email && (
                                    <div className={styles.contactItem}>
                                        <MailOutlined className={styles.contactIcon}/>
                                        <div className={styles.contactValue}>
                                            <a
                                                href={`mailto:${apartment.owner.email}?subject=Вопрос по объявлению ${apartment.id}`}
                                                className={styles.contactLink}
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                {apartment.owner.email}
                                            </a>
                                        </div>
                                    </div>
                                )}

                                {(!apartment.owner.phone && !apartment.owner.email) && (
                                    <div className={styles.noContacts}>
                                        Контактная информация не указана
                                    </div>
                                )}
                            </div>

                            <div className={styles.contactButtons}>
                                {apartment.owner.phone && (
                                    <>
                                        <Button
                                            type="primary"
                                            className={styles.contactButton}
                                            icon={<PhoneOutlined/>}
                                            onClick={() => window.open(`tel:${apartment.owner.phone.replace(/[^0-9+]/g, '')}`, '_blank')}
                                            block
                                        >
                                            Позвонить
                                        </Button>
                                        <Button
                                            className={`${styles.contactButton} ${styles.whatsappButton}`}
                                            icon={<MessageOutlined/>}
                                            onClick={() => window.open(`https://wa.me/${apartment.owner.phone.replace(/[^0-9]/g, '')}`, '_blank')}
                                            block
                                        >
                                            WhatsApp
                                        </Button>
                                        {/*<Button*/}
                                        {/*    className={`${styles.contactButton} ${styles.telegramButton}`}*/}
                                        {/*    icon={<CommentOutlined/>}*/}
                                        {/*    onClick={() => window.open(`https://t.me/${apartment.owner.phone.replace(/[^0-9]/g, '')}`, '_blank')}*/}
                                        {/*    block*/}
                                        {/*>*/}
                                        {/*    Telegram*/}
                                        {/*</Button>*/}
                                    </>
                                )}

                                {/*{apartment.owner.email && (*/}
                                {/*    <Button*/}
                                {/*        className={`${styles.contactButton} ${styles.emailButton}`}*/}
                                {/*        icon={<MailOutlined/>}*/}
                                {/*        onClick={() => window.open(`mailto:${apartment.owner.email}?subject=Вопрос по объявлению ${apartment.id}`, '_blank')}*/}
                                {/*        block*/}
                                {/*    >*/}
                                {/*        Написать email*/}
                                {/*    </Button>*/}
                                {/*)}*/}
                            </div>
                        </Card>
                    </div>
                )}

                {/* Дополнительная информация */}
                <div className={styles.metaInfo}>
                    <div className={styles.metaItem}>
                        <span className={styles.metaLabel}>Дата публикации:</span>
                        <span className={styles.metaValue}>
                            {apartment.created_at ? (
                                new Date(apartment.created_at).toLocaleDateString('ru-RU', {
                                    day: '2-digit',
                                    month: 'long',
                                    year: 'numeric'
                                })
                            ) : 'Не указана'}
                        </span>
                    </div>

                    <div className={styles.metaItem}>
                        <span className={styles.metaLabel}>ID объекта:</span>
                        <span className={styles.metaValue}>{apartment.id}</span>
                    </div>
                </div>
            </div>

            {/* Модальное окно галереи */}
            <Modal
                open={isGalleryOpen}
                onCancel={closeFullscreenGallery}
                footer={null}
                className={styles.galleryModal}
                width="100%"
                style={{top: 0}}
                styles={{
                    body: {
                        padding: 0,
                        height: '100vh',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        background: 'rgba(0, 0, 0, 0.9)'
                    }
                }}
                closeIcon={<FullscreenExitOutlined style={{color: 'white'}}/>}
            >
                <div className={styles.fullscreenGallery}>
                    <img
                        src={apartment.images[currentImageIndex]?.image}
                        alt={`Фото объекта ${currentImageIndex + 1}`}
                        className={styles.fullscreenImage}
                    />

                    <Button
                        shape="circle"
                        icon={<LeftOutlined/>}
                        className={`${styles.navArrow} ${styles.fullscreenNavArrow} ${styles.leftArrow}`}
                        onClick={goToPrevImage}
                    />

                    <Button
                        shape="circle"
                        icon={<RightOutlined/>}
                        className={`${styles.navArrow} ${styles.fullscreenNavArrow} ${styles.rightArrow}`}
                        onClick={goToNextImage}
                    />

                    <div className={styles.imageCounter}>
                        {currentImageIndex + 1} / {apartment.images.length}
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ListingDetails;