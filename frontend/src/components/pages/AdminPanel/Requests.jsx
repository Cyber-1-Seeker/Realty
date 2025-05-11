import {useEffect, useState} from 'react';
import {Table, Select, Button, Popconfirm, message} from 'antd';
import {API_AUTH} from "@/utils/api/axiosWithAuth.js";
import {Grid} from 'antd';

const {Option} = Select;
const {useBreakpoint} = Grid;

export default function Requests() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const screens = useBreakpoint();

    // Цвета и метки статуса
    const statusLabels = {
        new: 'Новая',
        in_progress: 'В процессе',
        done: 'Завершена',
    };

    // Загрузка заявок с сервера
    const fetchRequests = async () => {
        setLoading(true);
        try {
            const res = await API_AUTH.get('/api/applications/applications/');
            // Добавляем индекс для стабильной нумерации
            const dataWithIndex = res.data.map((item, idx) => ({
                ...item,
                index: res.data.length - idx,
            }));

            setRequests(dataWithIndex);
        } catch {
            message.error('Ошибка при загрузке заявок');
        } finally {
            setLoading(false);
        }
    };

    // Обновление статуса заявки
    const updateStatus = async (id, status) => {
        try {
            await API_AUTH.patch(`/api/applications/applications/${id}/`, {status});
            message.success('Статус обновлён');
            fetchRequests();
        } catch {
            message.error('Ошибка при обновлении статуса');
        }
    };

    // Удаление заявки
    const deleteRequest = async (id) => {
        try {
            await API_AUTH.delete(`/api/applications/applications/${id}/`);
            message.success('Заявка удалена');
            fetchRequests();
        } catch {
            message.error('Ошибка при удалении');
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const columns = [
        {
            title: '№',
            dataIndex: 'index',
            key: 'index',
            width: 50,
        },
        {title: 'Имя', dataIndex: 'name', key: 'name'},
        {title: 'Телефон', dataIndex: 'phone', key: 'phone'},
        {title: 'Комментарий', dataIndex: 'comment', key: 'comment'},
        {
            title: 'Дата',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (date) => new Date(date).toLocaleString(),
        },
        {
            title: 'Статус',
            dataIndex: 'status',
            key: 'status',
            render: (status, record) => (
                <Select
                    defaultValue={status}
                    style={{width: 150}}
                    onChange={(value) => updateStatus(record.id, value)}
                >
                    {Object.entries(statusLabels).map(([key, label]) => (
                        <Option value={key} key={key}>{label}</Option>
                    ))}
                </Select>
            ),
        },
        {
            title: '',
            key: 'actions',
            render: (_, record) => (
                <Popconfirm
                    title="Удалить заявку?"
                    onConfirm={() => deleteRequest(record.id)}
                    okText="Да"
                    cancelText="Нет"
                >
                    <Button danger>Удалить</Button>
                </Popconfirm>
            ),
        },
    ];

    return (
        <>
            <h1 style={{fontSize: 24, fontWeight: 'bold', marginBottom: 16}}>ЗАЯВКИ</h1>
            <Table
                columns={columns}
                dataSource={requests}
                rowKey="id"
                loading={loading}
                pagination={false}
                scroll={{x: true}}
                size={screens.xs ? 'small' : 'middle'}
            />
        </>
    );
}
