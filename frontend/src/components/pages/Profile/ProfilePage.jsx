import React, {useEffect, useState} from 'react';
import {secureFetch} from '@/utils/api';
import {Button, Modal, Table, Tag, Spin, message, Space, Image, Popconfirm} from 'antd';
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
    PlusOutlined
} from '@ant-design/icons';
import styles from './ProfilePage.module.css';

import ModalForm from "@/components/pages/Listings/ListingsPage/ModalForm.jsx";
import AddListingForm from "@/components/pages/Listings/ListingsPage/AddListingForm.jsx";

const {confirm} = Modal;

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [apartments, setApartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);
    const [deletingAccount, setDeletingAccount] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);


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
            dataIndex: 'is_active',
            key: 'is_active',
            render: (isActive) => (
                <Tag
                    color={isActive ? 'green' : 'orange'}
                    icon={isActive ? <CheckCircleOutlined/> : <CloseCircleOutlined/>}
                >
                    {isActive ? 'Опубликовано' : 'Не опубликовано'}
                </Tag>
            ),
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
                        Просмотр
                    </Button>
                    <Button
                        type="link"
                        icon={<EditOutlined/>}
                        href={`/edit-apartment/${record.id}`}
                        className={styles.actionButton}
                    >
                        Редактировать
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
        <div className={styles.profileContainer}>
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