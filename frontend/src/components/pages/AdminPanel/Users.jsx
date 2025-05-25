import {useEffect, useState} from 'react';
import {Table, Button, Popconfirm, Switch, message, Input, Row, Col} from 'antd';
import {API_AUTH} from '@/utils/api/axiosWithAuth';
import {Grid} from 'antd';

const {useBreakpoint} = Grid;

export default function Users() {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [currentUserId, setCurrentUserId] = useState(null);
    const screens = useBreakpoint();

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const [usersRes, meRes] = await Promise.all([
                API_AUTH.get('/api/accounts/users/'),
                API_AUTH.get('/api/accounts/me/')
            ]);
            const indexed = usersRes.data.map((user, idx) => ({
                ...user,
                index: usersRes.data.length - idx,
            }));
            setUsers(indexed);
            setFilteredUsers(indexed);
            setCurrentUserId(meRes.data.id);
        } catch {
            message.error('Ошибка при загрузке пользователей');
        } finally {
            setLoading(false);
        }
    };

    const toggleActive = async (id, isActive) => {
        try {
            await API_AUTH.patch(`/api/accounts/users/${id}/`, {is_active: isActive});
            message.success('Статус пользователя обновлён');
            fetchUsers();
        } catch {
            message.error('Ошибка при обновлении статуса');
        }
    };

    const deleteUser = async (id) => {
        try {
            await API_AUTH.delete(`/api/accounts/users/${id}/`);
            message.success('Пользователь удалён');
            fetchUsers();
        } catch {
            message.error('Ошибка при удалении пользователя');
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        const lower = search.toLowerCase();
        const filtered = users.filter(u =>
            u.first_name?.toLowerCase().includes(lower) ||
            u.email?.toLowerCase().includes(lower) ||
            u.phone_number?.toLowerCase().includes(lower)
        );
        setFilteredUsers(filtered);
    }, [search, users]);

    const columns = [
        {title: '№', dataIndex: 'index', key: 'index', width: 50},
        {title: 'Имя', dataIndex: 'first_name', key: 'first_name'},
        {title: 'Email', dataIndex: 'email', key: 'email'},
        {title: 'Телефон', dataIndex: 'phone_number', key: 'phone_number'},
        {
            title: 'Активен',
            dataIndex: 'is_active',
            key: 'is_active',
            render: (isActive, record) => (
                <Switch
                    checked={isActive}
                    onChange={(val) => toggleActive(record.id, val)}
                    disabled={record.id === currentUserId}
                />
            ),
        },
        {
            title: '',
            key: 'actions',
            render: (_, record) => (
                <Popconfirm
                    title="Удалить пользователя?"
                    onConfirm={() => deleteUser(record.id)}
                    okText="Да"
                    cancelText="Нет"
                    disabled={record.id === currentUserId}
                >
                    <Button danger disabled={record.id === currentUserId}>Удалить</Button>
                </Popconfirm>
            ),
        },
    ];

    return (
        <>
            <h1 style={{fontSize: 24, fontWeight: 'bold', marginBottom: 16}}>ПОЛЬЗОВАТЕЛИ</h1>

            <Row gutter={[16, 16]} style={{marginBottom: 16}}>
                <Col xs={24} sm={12} md={8}>
                    <Input
                        placeholder="Поиск по имени, email или телефону"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        allowClear
                    />
                </Col>
            </Row>

            <Table
                columns={columns}
                dataSource={filteredUsers}
                rowKey="id"
                loading={loading}
                pagination={false}
                scroll={{x: true}}
                size={screens.xs ? 'small' : 'middle'}
            />
        </>
    );
}
