import {
    Table,
    Select,
    Button,
    Space,
    Popconfirm,
    message,
    Dropdown,
    Menu,
    Spin,
    Modal,
    Input
} from 'antd';
import {useState, useEffect} from 'react';
import {API_AUTH} from '@/utils/api/axiosWithAuth';

const {Option} = Select;
const {TextArea} = Input;

export default function Listings() {
    const [apartments, setApartments] = useState([]);
    const [statusFilter, setStatusFilter] = useState(null);
    const [loading, setLoading] = useState(false);
    const [rejectingId, setRejectingId] = useState(null);
    const [rejectReason, setRejectReason] = useState('');

    const fetchApartments = async () => {
        setLoading(true);
        try {
            const res = await API_AUTH.get('/api/apartment/admin-apartments/');
            setApartments(res.data);
        } catch (err) {
            console.error('Ошибка загрузки:', err);
            message.error('Ошибка загрузки объявлений');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApartments();
    }, []);

    const handleSetStatus = async (id, status, reason = null) => {
        try {
            await API_AUTH.patch(`/api/apartment/admin-apartments/${id}/set_status/`, {
                status,
                rejection_reason: reason
            });
            message.success('Статус обновлён');
            fetchApartments();
        } catch (err) {
            console.error('Ошибка статуса:', err);
            message.error('Ошибка при обновлении статуса');
        }
    };

    const handleSetActive = async (id, isActive) => {
        try {
            await API_AUTH.patch(`/api/apartment/admin-apartments/${id}/set_active/`, {
                is_active: isActive,
            });
            message.success(`Видимость обновлена на ${isActive ? 'опубликовано' : 'скрыто'}`);
            fetchApartments();
        } catch (err) {
            console.error('Ошибка статуса:', err);
            message.error('Ошибка при обновлении видимости');
        }
    };

    const handleDelete = async (id) => {
        try {
            await API_AUTH.delete(`/api/apartment/admin-apartments/${id}/`);
            message.success('Объявление удалено');
            fetchApartments();
        } catch (err) {
            console.error('Ошибка удаления:', err);
            message.error('Ошибка при удалении');
        }
    };

    const filtered = apartments.filter(item => {
        if (!statusFilter) return true;

        switch (statusFilter) {
            case 'published':
                return item.status === 'approved' && item.is_active;
            case 'draft':
                return item.status === 'approved' && !item.is_active;
            default:
                return item.status === statusFilter;
        }
    });

    const statusOptions = [
        {value: 'pending', label: 'На рассмотрении'},
        {value: 'rejected', label: 'Отклонено'},
        {value: 'published', label: 'Опубликовано'},
        {value: 'draft', label: 'Принято (черновик)'},
    ];

    const columns = [
        {
            title: 'Фото',
            key: 'image',
            render: (_, record) => {
                const image = record.images?.[0]?.image;
                return image ? (
                    <img
                        src={image}
                        alt="preview"
                        style={{width: 100, height: 75, objectFit: 'cover', borderRadius: 4}}
                    />
                ) : (
                    <div style={{
                        width: 100,
                        height: 75,
                        background: '#f0f0f0',
                        color: '#888',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 4
                    }}>
                        Нет фото
                    </div>
                );
            },
        },
        {
            title: 'Адрес',
            dataIndex: 'address',
            key: 'address'
        },
        {
            title: 'Владелец',
            key: 'owner',
            render: (_, record) => (
                <>
                    <div><strong>{record.owner?.name || '—'}</strong></div>
                    <div>{record.owner?.email || '—'}</div>
                    <div>{record.owner?.phone || '—'}</div>
                </>
            )
        },
        {
            title: 'Дата добавления',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (text) =>
                new Date(text).toLocaleString('ru-RU', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                }),
        },
        {
            title: 'Статус',
            key: 'status',
            render: (_, record) => {
                let statusText;
                switch (record.status) {
                    case 'pending':
                        statusText = 'На рассмотрении';
                        break;
                    case 'rejected':
                        statusText = 'Отклонено';
                        break;
                    case 'approved':
                        statusText = record.is_active ? 'Опубликовано' : 'Принято (черновик)';
                        break;
                    default:
                        statusText = 'Неизвестно';
                }
                return <div>{statusText}</div>;
            }
        },
        {
            title: 'Действия',
            key: 'action',
            render: (_, record) => {
                const statusMenuItems = [
                    {key: 'approved', label: 'Принять'},
                    {key: 'rejected', label: 'Отклонить'},
                    {key: 'pending', label: 'Вернуть на рассмотрение'},
                ];

                const visibilityMenuItems = [
                    {
                        key: 'true',
                        label: 'Опубликовать',
                        disabled: record.is_active
                    },
                    {
                        key: 'false',
                        label: 'Снять с публикации',
                        disabled: !record.is_active
                    },
                ];

                return (
                    <Space>
                        <Button type="link" target="_blank" href={`/listings/${record.id}`}>
                            Предпросмотр
                        </Button>

                        <Dropdown
                            menu={{
                                items: statusMenuItems,
                                onClick: ({key}) => {
                                    if (key === 'rejected') {
                                        setRejectingId(record.id);
                                    } else {
                                        handleSetStatus(record.id, key);
                                    }
                                }
                            }}
                        >
                            <Button>Изменить статус</Button>
                        </Dropdown>

                        {record.status === 'approved' && (
                            <Dropdown
                                menu={{
                                    items: visibilityMenuItems,
                                    onClick: ({key}) => handleSetActive(record.id, key === 'true')
                                }}
                            >
                                <Button>Видимость</Button>
                            </Dropdown>
                        )}

                        <Popconfirm
                            title="Удалить это объявление?"
                            onConfirm={() => handleDelete(record.id)}
                            okText="Да"
                            cancelText="Нет"
                        >
                            <Button danger>Удалить</Button>
                        </Popconfirm>
                    </Space>
                );
            },
        },
    ];

    return (
        <>
            <h1>ОБЪЯВЛЕНИЯ</h1>
            <Space style={{marginBottom: 16}}>
                <Select
                    placeholder="Все статусы"
                    onChange={setStatusFilter}
                    allowClear
                    style={{minWidth: 200}}
                    options={statusOptions}
                />
            </Space>
            <Spin spinning={loading}>
                <Table columns={columns} dataSource={filtered} rowKey="id"/>
            </Spin>

            <Modal
                title="Укажите причину отклонения"
                open={rejectingId !== null}
                onOk={() => {
                    handleSetStatus(rejectingId, 'rejected', rejectReason);
                    setRejectingId(null);
                    setRejectReason('');
                }}
                onCancel={() => {
                    setRejectingId(null);
                    setRejectReason('');
                }}
                okText="Подтвердить"
                cancelText="Отмена"
            >
                <TextArea
                    rows={4}
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Причина отклонения (необязательно)"
                    maxLength={500}
                    showCount
                />
            </Modal>
        </>
    );
}