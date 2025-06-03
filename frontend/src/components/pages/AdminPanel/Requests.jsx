import {useEffect, useState} from 'react';
import {Table, Select, Button, Popconfirm, message, Input, Row, Col, DatePicker} from 'antd';
import {API_AUTH} from "@/utils/api/axiosWithAuth.js";
import {Grid} from 'antd';
import dayjs from 'dayjs';

const {Option} = Select;
const {RangePicker} = DatePicker;
const {useBreakpoint} = Grid;

const statusLabels = {
    new: 'Новая',
    in_progress: 'В процессе',
    done: 'Завершена',
};

export default function Requests() {
    const [requests, setRequests] = useState([]);
    const [filteredRequests, setFilteredRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [requestTypeFilter, setRequestTypeFilter] = useState('');
    const [dateRange, setDateRange] = useState([]);
    const screens = useBreakpoint();

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const res = await API_AUTH.get('/api/applications/applications/');
            const dataWithIndex = res.data.map((item, idx) => ({
                ...item,
                index: res.data.length - idx,
            }));
            setRequests(dataWithIndex);
            setFilteredRequests(dataWithIndex);
        } catch (error) {
            if (error.response?.status === 401) {
                message.error('Ошибка авторизации. Проверьте токен.');
            } else {
                message.error('Ошибка при загрузке заявок');
            }
        } finally {
            setLoading(false);
        }
    };
    const updateStatus = async (id, status) => {
        try {
            await API_AUTH.patch(`/api/applications/applications/${id}/`, {status});
            message.success('Статус обновлён');
            fetchRequests();
        } catch {
            message.error('Ошибка при обновлении статуса');
        }
    };

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

    useEffect(() => {
        const lowerSearch = search.toLowerCase();

        const filtered = requests.filter(req => {
            const matchSearch =
                req.name?.toLowerCase().includes(lowerSearch) ||
                req.phone?.toLowerCase().includes(lowerSearch) ||
                req.comment?.toLowerCase().includes(lowerSearch);

            const matchStatus = statusFilter ? req.status === statusFilter : true;

            const matchDate =
                dateRange.length === 2
                    ? dayjs(req.created_at).isAfter(dateRange[0].startOf('day')) &&
                    dayjs(req.created_at).isBefore(dateRange[1].endOf('day'))
                    : true;

            const matchType =
                requestTypeFilter === 'advance'
                    ? req.comment?.includes('аванс')
                    : requestTypeFilter === 'urgent'
                        ? req.comment?.includes('Срочная продажа')
                        : requestTypeFilter === 'order'
                            ? req.comment?.includes('Запрос на оценку')
                            : requestTypeFilter === 'other'
                                ? !req.comment?.includes('аванс') &&
                                !req.comment?.includes('Срочная продажа') &&
                                !req.comment?.includes('Запрос на оценку')
                                : true;

            return matchSearch && matchStatus && matchDate && matchType;
        });

        setFilteredRequests(filtered);
    }, [search, statusFilter, requestTypeFilter, dateRange, requests]);

    const columns = [
        {title: '№', dataIndex: 'index', key: 'index', width: 50},
        {title: 'Имя', dataIndex: 'name', key: 'name'},
        {title: 'Телефон', dataIndex: 'phone', key: 'phone'},
        {title: 'Комментарий', dataIndex: 'comment', key: 'comment'},
        {
            title: 'Дата',
            dataIndex: 'created_at',
            key: 'created_at',
            sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
            render: (date) => new Date(date).toLocaleString(),
        },
        {
            title: 'Статус',
            dataIndex: 'status',
            key: 'status',
            render: (status, record) => (
                <Select
                    value={status}
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

            <Row gutter={[16, 16]} style={{marginBottom: 16}}>
                <Col xs={24} sm={12} md={6}>
                    <Input
                        placeholder="Поиск по имени или телефону"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        allowClear
                    />
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Select
                        placeholder="Фильтр по статусу"
                        value={statusFilter || undefined}
                        onChange={(value) => setStatusFilter(value)}
                        allowClear
                        style={{width: '100%'}}
                    >
                        {Object.entries(statusLabels).map(([value, label]) => (
                            <Option key={value} value={value}>{label}</Option>
                        ))}
                    </Select>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Select
                        placeholder="Тип заявки"
                        value={requestTypeFilter || undefined}
                        onChange={(value) => setRequestTypeFilter(value)}
                        allowClear
                        style={{width: '100%'}}
                    >
                        <Option value="">Все заявки</Option>
                        <Option value="advance">Запрос на аванс</Option>
                        <Option value="urgent">Срочная продажа</Option>
                        <Option value="order">Запрос на оценку</Option>
                        <Option value="other">Другие заявки</Option>
                    </Select>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <RangePicker
                        style={{width: '100%'}}
                        value={dateRange}
                        onChange={(dates) => setDateRange(dates || [])}
                        allowClear
                    />
                </Col>
            </Row>

            <Table
                columns={columns}
                dataSource={filteredRequests}
                rowKey="id"
                loading={loading}
                pagination={false}
                scroll={{x: true}}
                size={screens.xs ? 'small' : 'middle'}
            />
        </>
    );
}