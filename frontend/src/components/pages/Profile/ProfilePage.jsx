import React, {useEffect, useState} from 'react';
import {secureFetch} from '@/utils/api';
import {Button, Modal, Table, Tag, Spin, message, Space, Image, Popconfirm, Tooltip} from 'antd';
import {
    ExclamationCircleOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    EyeOutlined,
    DeleteOutlined,
    EditOutlined,
    UserOutlined,
    MailOutlined,
    PhoneOutlined,
    PlusOutlined,
    InfoCircleOutlined
} from '@ant-design/icons';
import { useTheme } from '@/context/ThemeContext';
import styles from './ProfilePage.module.css';

import ModalForm from "@/components/pages/Listings/ListingsPage/ModalForm.jsx";
import AddListingForm from "@/components/pages/Listings/ListingsPage/AddListingForm.jsx";

const {confirm} = Modal;

const ProfilePage = () => {
    const { theme } = useTheme();
    const [user, setUser] = useState(null);
    const [apartments, setApartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);
    const [deletingAccount, setDeletingAccount] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [statusModalVisible, setStatusModalVisible] = useState(false);
    const [currentApartment, setCurrentApartment] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [userRes, apartmentsRes] = await Promise.all([
                    secureFetch('/api/accounts/me/'),
                    secureFetch('/api/apartment/apartments/my/')
                ]);

                setUser(await userRes.json());
                setApartments(await apartmentsRes.json());
            } catch (error) {
                console.error('Ошибка загрузки данных:', error);
                message.error('Не удалось загрузить данные профиля');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleLogout = () => {
        confirm({
            title: 'Вы уверены, что хотите выйти из аккаунта?',
            icon: <ExclamationCircleOutlined/>,
            okText: 'Выйти',
            cancelText: 'Отмена',
            onOk: async () => {
                try {
                    await secureFetch('/api/accounts/logout/', {method: 'POST'});
                    window.location.href = '/';
                } catch (error) {
                    message.error('Ошибка при выходе из системы');
                }
            },
        });
    };

    const handleDeleteAccount = () => {
        confirm({
            title: 'Вы уверены, что хотите удалить свой аккаунт?',
            icon: <ExclamationCircleOutlined/>,
            content: 'Это действие нельзя отменить. Все ваши данные, включая объявления, будут удалены.',
            okText: 'Да, удалить',
            okType: 'danger',
            cancelText: 'Отмена',
            onOk: async () => {
                setDeletingAccount(true);
                try {
                    await secureFetch('/api/accounts/users/me/delete/', {
                        method: 'DELETE'
                    });
                    message.success('Аккаунт успешно удален');
                    window.location.href = '/';
                } catch (error) {
                    console.error('Ошибка удаления аккаунта:', error);
                    message.error('Не удалось удалить аккаунт');
                } finally {
                    setDeletingAccount(false);
                }
            },
        });
    };

    const handleDeleteApartment = async (id) => {
        setDeletingId(id);
        try {
            await secureFetch(`/api/apartment/apartments/${id}/`, {
                method: 'DELETE'
            });
            message.success('Объявление успешно удалено');
            setApartments(apartments.filter(apartment => apartment.id !== id));
        } catch (error) {
            console.error('Ошибка удаления:', error);
            message.error('Не удалось удалить объявление');
        } finally {
            setDeletingId(null);
        }
    };

    const showDeleteConfirm = (id) => {
        confirm({
            title: 'Вы уверены, что хотите удалить это объявление?',
            icon: <ExclamationCircleOutlined/>,
            content: 'Это действие нельзя отменить',
            okText: 'Да, удалить',
            okType: 'danger',
            cancelText: 'Отмена',
            onOk() {
                return handleDeleteApartment(id);
            },
        });
    };

    const showStatusInfo = (apartment) => {
        setCurrentApartment(apartment);
        setStatusModalVisible(true);
    };

    const getStatusInfo = (apartment) => {
        switch (apartment.status) {
            case 'pending':
                return {
                    title: 'На рассмотрении',
                    description: 'Ваше объявление ожидает проверки модератором. Обычно это занимает до 1 часа',
                    color: 'orange',
                    icon: <ExclamationCircleOutlined/>
                };
            case 'rejected':
                return {
                    title: 'Отклонено',
                    description: apartment.rejection_reason
                        ? `Причина отклонения: ${apartment.rejection_reason}`
                        : 'Объявление отклонено модератором. Пожалуйста, проверьте соответствие требованиям.',
                    color: 'red',
                    icon: <CloseCircleOutlined/>
                };
            case 'approved':
                if (apartment.is_active) {
                    return {
                        title: 'Опубликовано',
                        description: 'Ваше объявление прошло модерацию и опубликовано на сайте.',
                        color: 'green',
                        icon: <CheckCircleOutlined/>
                    };
                } else {
                    return {
                        title: 'Принято (черновик)',
                        description: 'Ваше объявление прошло модерацию, но еще не опубликовано.',
                        color: 'blue',
                        icon: <CheckCircleOutlined/>
                    };
                }
            default:
                return {
                    title: 'Неизвестный статус',
                    description: 'Статус вашего объявления не определен. Пожалуйста, обратитесь в поддержку.',
                    color: 'gray',
                    icon: <ExclamationCircleOutlined/>
                };
        }
    };

    const columns = [
        {
            title: 'Фото',
            key: 'image',
            render: (_, record) => {
                const image = record.images?.[0]?.image;
                return image ? (
                    <Image
                        src={image}
                        alt="preview"
                        width={100}
                        height={75}
                        style={{objectFit: 'cover', borderRadius: 4}}
                        preview={{
                            mask: <EyeOutlined style={{color: '#fff', fontSize: 18}}/>,
                            maskClassName: styles.imagePreviewMask
                        }}
                    />
                ) : (
                    <div className={styles.noImagePlaceholder}>
                        Нет фото
                    </div>
                );
            },
        },
        {
            title: 'Адрес',
            dataIndex: 'address',
            key: 'address',
            width: '25%'
        },
        {
            title: 'Цена',
            dataIndex: 'price',
            key: 'price',
            render: (price) => `${price?.toLocaleString('ru-RU') || '0'} ₽`,
            width: '15%'
        },
        {
            title: 'Комнат',
            dataIndex: 'rooms',
            key: 'rooms',
            width: '10%'
        },
        {
            title: 'Статус',
            key: 'status',
            render: (_, record) => {
                const statusInfo = getStatusInfo(record);
                return (
                    <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
                        <Tag color={statusInfo.color} icon={statusInfo.icon}>
                            {statusInfo.title}
                        </Tag>
                        <Tooltip title="Подробнее о статусе">
                            <InfoCircleOutlined
                                style={{color: '#1890ff', cursor: 'pointer'}}
                                onClick={() => showStatusInfo(record)}
                            />
                        </Tooltip>
                    </div>
                );
            },
            width: '15%'
        },
        {
            title: 'Действия',
            key: 'action',
            render: (_, record) => (
                <Space>
                    <Button
                        type="link"
                        icon={<EyeOutlined/>}
                        href={`/listings/${record.id}`}
                        target="_blank"
                        className={styles.actionButton}
                    >
                        Посмотреть
                    </Button>
                    <Popconfirm
                        title="Удалить объявление?"
                        description="Вы уверены, что хотите удалить это объявление?"
                        onConfirm={() => showDeleteConfirm(record.id)}
                        okText="Да"
                        cancelText="Нет"
                        okButtonProps={{loading: deletingId === record.id}}
                    >
                        <Button
                            type="link"
                            icon={<DeleteOutlined/>}
                            danger
                            loading={deletingId === record.id}
                            className={styles.actionButton}
                        >
                            Удалить
                        </Button>
                    </Popconfirm>
                </Space>
            ),
            width: '20%'
        },
    ];

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <Spin size="large"/>
            </div>
        );
    }

    return (
        <div className={`${styles.profileContainer} ${theme === 'dark' ? styles.dark : ''}`}>

            <div className={styles.profileHeader}>
                <h1>Профиль пользователя</h1>
            </div>

            <div className={styles.profileContent}>
                <div className={styles.userInfoCard}>
                    <div className={styles.userInfoHeader}>
                        <h2>
                            <UserOutlined style={{marginRight: 10}}/>
                            Личные данные
                        </h2>
                    </div>

                    <div className={styles.userInfo}>
                        <div className={styles.infoItem}>
                            <UserOutlined className={styles.infoIcon}/>
                            <div>
                                <div className={styles.infoLabel}>Имя</div>
                                <div className={styles.infoValue}>{user?.first_name || 'Не указано'}</div>
                            </div>
                        </div>

                        <div className={styles.infoItem}>
                            <MailOutlined className={styles.infoIcon}/>
                            <div>
                                <div className={styles.infoLabel}>Email</div>
                                <div className={styles.infoValue}>{user?.email || 'Не указан'}</div>
                            </div>
                        </div>

                        <div className={styles.infoItem}>
                            <PhoneOutlined className={styles.infoIcon}/>
                            <div>
                                <div className={styles.infoLabel}>Телефон</div>
                                <div className={styles.infoValue}>{user?.phone_number || 'Не указан'}</div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.accountActions}>
                        <Button
                            type="primary"
                            danger
                            onClick={handleLogout}
                            className={styles.logoutButton}
                        >
                            Выйти из аккаунта
                        </Button>
                        <Button
                            type="default"
                            danger
                            onClick={handleDeleteAccount}
                            className={styles.deleteAccountButton}
                            loading={deletingAccount}
                            icon={<DeleteOutlined/>}
                        >
                            Удалить аккаунт
                        </Button>
                    </div>
                </div>

                <div className={styles.apartmentsSection}>
                    <div className={styles.apartmentsHeader}>
                        <h2>Мои объявления</h2>
                        <Button
                            type="primary"
                            icon={<PlusOutlined/>}
                            onClick={() => setShowAddForm(true)}
                            className={styles.addButton}
                        >
                            Добавить объявление
                        </Button>
                    </div>

                    {apartments.length > 0 ? (
                        <Table
                            columns={columns}
                            dataSource={apartments}
                            rowKey="id"
                            pagination={{pageSize: 5}}
                            className={styles.apartmentsTable}
                            scroll={{x: 'max-content'}}
                        />
                    ) : (
                        <div className={styles.noApartments}>
                            <p>У вас пока нет добавленных объявлений</p>
                            <Button
                                type="primary"
                                icon={<PlusOutlined/>}
                                onClick={() => setShowAddForm(true)}
                            >
                                Добавить объявление
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Модальное окно с информацией о статусе */}
            <Modal
                title="Статус объявления"
                open={statusModalVisible}
                onCancel={() => setStatusModalVisible(false)}
                footer={[
                    <Button key="close" onClick={() => setStatusModalVisible(false)}>
                        Закрыть
                    </Button>
                ]}
                centered
            >
                {currentApartment && (
                    <div className={styles.statusInfoContainer}>
                        <div className={styles.statusHeader}>
                            <h3>{currentApartment.address}</h3>
                            <Tag
                                color={getStatusInfo(currentApartment).color}
                                style={{fontSize: '14px', padding: '4px 8px'}}
                            >
                                {getStatusInfo(currentApartment).title}
                            </Tag>
                        </div>

                        <div className={styles.statusDescription}>
                            {getStatusInfo(currentApartment).description}
                        </div>

                        {currentApartment.status === 'rejected' && (
                            <div className={styles.rejectionActions}>

                            </div>
                        )}
                    </div>
                )}
            </Modal>

            {/* Модальное окно для добавления объявления */}
            <ModalForm
                isOpen={showAddForm}
                onClose={() => setShowAddForm(false)}
                title="Добавить новое объявление"
            >
                <AddListingForm
                    onClose={() => setShowAddForm(false)}
                    onSuccess={(newApartment) => {
                        setApartments([...apartments, newApartment]);
                        message.success('Объявление успешно добавлено');
                    }}
                />
            </ModalForm>
        </div>
    );
};

export default ProfilePage;