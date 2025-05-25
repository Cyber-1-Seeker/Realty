import {
    Table,
    Select,
    Button,
    Space,
    Popconfirm,
    message,
    Dropdown,
    Menu,
    Spin
} from 'antd';
import {useState, useEffect} from 'react';
import {API_AUTH} from '@/utils/api/axiosWithAuth';

const {Option} = Select;

export default function Listings() {
    const [apartments, setApartments] = useState([]);
    const [statusFilter, setStatusFilter] = useState(null);
    const [loading, setLoading] = useState(false);

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

    const handleSetStatus = async (id, isActive) => {
        try {
            await API_AUTH.patch(`/api/apartment/admin-apartments/${id}/set_active/`, {
                is_active: isActive,
            });
            message.success(`Статус обновлён на ${isActive ? 'опубликовано' : 'черновик'}`);
            fetchApartments();
        } catch (err) {
            console.error('Ошибка статуса:', err);
            message.error('Ошибка при обновлении статуса');
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

    const filtered = apartments.filter(
        (item) =>
            !statusFilter ||
            (statusFilter === 'Опубликовано' && item.is_active) ||
            (statusFilter === 'Черновик' && !item.is_active)
    );

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
            render: (_, record) => record.is_active ? 'Опубликовано' : 'Черновик'
        },
        {
            title: 'Действия',
            key: 'action',
            render: (_, record) => (
                <Space>
                    <Button type="link" target="_blank" href={`/listings/${record.id}`}>
                        Предпросмотр
                    </Button>

                    <Dropdown
                        overlay={
                            <Menu
                                onClick={({key}) => handleSetStatus(record.id, key === 'true')}
                                items={[
                                    {key: 'true', label: 'Опубликовать'},
                                    {key: 'false', label: 'Сделать черновиком'},
                                ]}
                            />
                        }
                    >
                        <Button>Изменить статус</Button>
                    </Dropdown>

                    <Popconfirm
                        title="Удалить это объявление?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Да"
                        cancelText="Нет"
                    >
                        <Button danger>Удалить</Button>
                    </Popconfirm>
                </Space>
            ),
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
                    style={{minWidth: 160}}
                >
                    <Option value="Опубликовано">Опубликовано</Option>
                    <Option value="Черновик">Черновик</Option>
                </Select>
            </Space>
            <Spin spinning={loading}>
                <Table columns={columns} dataSource={filtered} rowKey="id"/>
            </Spin>
        </>
    );
}
