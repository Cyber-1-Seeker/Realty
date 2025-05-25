import {useEffect, useState} from 'react';
import {Table, Button, Select, message, Spin, Input, Row, Col} from 'antd';
import {API_AUTH} from '@/utils/api/axiosWithAuth';

const roleLabels = {
    admin: 'Админ',
    manager: 'Менеджер',
    moderator: 'Модератор',
    user: 'Пользователь'
};

export default function Roles() {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [selectedRole, setSelectedRole] = useState('');

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await API_AUTH.get('/api/accounts/role-users/');
            setUsers(res.data);
            setFilteredUsers(res.data);
        } catch {
            message.error('Ошибка при загрузке пользователей');
        } finally {
            setLoading(false);
        }
    };

    const updateRole = async (id, role) => {
        try {
            await API_AUTH.patch(`/api/accounts/role-users/${id}/`, {role});
            message.success('Роль обновлена');
            fetchUsers();
        } catch {
            message.error('Ошибка при обновлении роли');
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        const lower = search.toLowerCase();
        const filtered = users.filter(user =>
            (!selectedRole || user.role === selectedRole) &&
            (user.first_name?.toLowerCase().includes(lower) || user.email?.toLowerCase().includes(lower))
        );
        setFilteredUsers(filtered);
    }, [search, selectedRole, users]);

    const columns = [
        {title: 'Имя', dataIndex: 'first_name', key: 'first_name'},
        {title: 'Email', dataIndex: 'email', key: 'email'},
        {
            title: 'Роль',
            key: 'role',
            render: (_, record) => (
                <Select
                    value={record.role}
                    onChange={(value) => updateRole(record.id, value)}
                    style={{width: 150}}
                >
                    {Object.entries(roleLabels).map(([value, label]) => (
                        <Select.Option key={value} value={value}>{label}</Select.Option>
                    ))}
                </Select>
            ),
        },
    ];

    return (
        <>
            <h1 style={{fontSize: 24, fontWeight: 'bold', marginBottom: 16}}>УПРАВЛЕНИЕ РОЛЯМИ</h1>

            <Row gutter={[16, 16]} style={{marginBottom: 16}}>
                <Col xs={24} sm={12} md={8}>
                    <Select
                        placeholder="Фильтр по роли"
                        value={selectedRole || undefined}
                        onChange={value => setSelectedRole(value)}
                        allowClear
                        style={{width: '100%'}}
                    >
                        {Object.entries(roleLabels).map(([value, label]) => (
                            <Select.Option key={value} value={value}>{label}</Select.Option>
                        ))}
                    </Select>
                </Col>

                <Col xs={24} sm={12} md={8}>
                    <Input
                        placeholder="Поиск по имени или email"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        allowClear
                    />
                </Col>
            </Row>

            {loading ? (
                <div style={{textAlign: 'center', padding: 40}}><Spin size="large"/></div>
            ) : (
                <Table
                    columns={columns}
                    dataSource={filteredUsers}
                    rowKey="id"
                    pagination={false}
                    scroll={{x: true}}
                />
            )}
        </>
    );
}
