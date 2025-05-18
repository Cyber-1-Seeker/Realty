import {Table, Select, Button, Space, Popconfirm, message, Dropdown, Menu} from 'antd';
import {useState, useEffect} from 'react';
import {API_AUTH} from '@/utils/api/axiosWithAuth';

const {Option} = Select;

export default function Listings() {
    const [apartments, setApartments] = useState([]);
    const [statusFilter, setStatusFilter] = useState(null);

    const fetchApartments = async () => {
        try {
            const res = await API_AUTH.get('/api/apartment/apartments/');
            setApartments(res.data);
        } catch (err) {
            console.error('Ошибка загрузки:', err);
        }
    };

    useEffect(() => {
        fetchApartments();
    }, []);

    const handleSetStatus = async (id, isActive) => {
        try {
            await API_AUTH.patch(`/api/apartment/apartments/${id}/toggle_active/`, {
                is_active: isActive,
            });
            fetchApartments();
            message.success(`Статус обновлён на ${isActive ? 'опубликовано' : 'черновик'}`);
        } catch (err) {
            message.error('Ошибка при обновлении статуса');
        }
    };

    const handleDelete = async (id) => {
        try {
            await API_AUTH.delete(`/api/apartment/apartments/${id}/`);
            fetchApartments();
            message.success('Удалено');
        } catch (err) {
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
        {title: 'Адрес', dataIndex: 'address', key: 'address'},
        {
            title: 'Владелец',
            key: 'owner',
            render: (_, record) => (
                <>
                    <div><strong>{record.owner?.name}</strong></div>
                    <div>{record.owner?.email}</div>
                    <div>{record.owner?.phone}</div>
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
                <Select placeholder="Все статусы" onChange={setStatusFilter} allowClear>
                    <Option value="Опубликовано">Опубликовано</Option>
                    <Option value="Черновик">Черновик</Option>
                </Select>
            </Space>
            <Table columns={columns} dataSource={filtered} rowKey="id"/>
        </>
    );
}
