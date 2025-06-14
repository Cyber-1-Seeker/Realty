import {useEffect, useState} from 'react';
import {Table, Button, Select, Spin, Input, Row, Col, message, Tooltip} from 'antd';
import {API_AUTH} from '@/utils/api/axiosWithAuth';
import {QuestionCircleOutlined} from '@ant-design/icons';

const roleLabels = {
    admin: 'Админ',
    manager: 'Менеджер',
    moderator: 'Модератор',
    user: 'Пользователь'
};

export default function Roles({onError}) {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [selectedRole, setSelectedRole] = useState('');
    const [editing, setEditing] = useState({});

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await API_AUTH.get('/api/accounts/role-users/');
            setUsers(res.data);
            setFilteredUsers(res.data);
        } catch (error) {
            onError(error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (id, field, value) => {
        setEditing(prev => ({
            ...prev,
            [id]: {
                ...prev[id],
                [field]: value
            }
        }));
    };

    const saveChanges = async (id) => {
        const changes = editing[id];
        if (!changes) return;

        try {
            await API_AUTH.patch(`/api/accounts/role-users/${id}/`, changes);
            message.success('Данные успешно обновлены');

            setUsers(prevUsers =>
                prevUsers.map(user =>
                    user.id === id ? {...user, ...changes} : user
                )
            );

            setEditing(prev => {
                const newState = {...prev};
                delete newState[id];
                return newState;
            });
        } catch (error) {
            onError(error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        const lower = search.toLowerCase();
        const filtered = users.filter(user =>
            (!selectedRole || user.role === selectedRole) &&
            (user.first_name?.toLowerCase().includes(lower) ||
                user.email?.toLowerCase().includes(lower) ||
                (user.telegram_id && user.telegram_id.toLowerCase().includes(lower)))
        );
        setFilteredUsers(filtered);
    }, [search, selectedRole, users]);

    const columns = [
        {title: 'Имя', dataIndex: 'first_name', key: 'first_name'},
        {title: 'Email', dataIndex: 'email', key: 'email'},
        {
            title: 'Telegram ID',
            dataIndex: 'telegram_id',
            key: 'telegram_id',
            render: (value, record) => (
                <Input
                    value={editing[record.id]?.telegram_id ?? value ?? ''}
                    placeholder="Не задан"
                    onChange={e => handleChange(record.id, 'telegram_id', e.target.value)}
                    style={{width: 150}}
                />
            ),
        },
        {
            title: 'Роль',
            key: 'role',
            render: (_, record) => (
                <Select
                    value={editing[record.id]?.role ?? record.role}
                    onChange={value => handleChange(record.id, 'role', value)}
                    style={{width: 150}}
                >
                    {Object.entries(roleLabels).map(([value, label]) => (
                        <Select.Option key={value} value={value}>{label}</Select.Option>
                    ))}
                </Select>
            ),
        },
        {
            title: 'Действия',
            key: 'actions',
            render: (_, record) => (
                <Button
                    type="primary"
                    onClick={() => saveChanges(record.id)}
                    disabled={!editing[record.id]}
                >
                    Сохранить
                </Button>
            ),
        }
    ];

    return (
        <>
            <h1 style={{fontSize: 24, fontWeight: 'bold', marginBottom: 16}}>
                УПРАВЛЕНИЕ РОЛЯМИ
                <Tooltip
                    title="Telegram ID можно получить через любого бота в Telegram, например, через @userinfobot"
                    placement="right"
                >
                    <QuestionCircleOutlined style={{marginLeft: 10, color: '#1890ff'}}/>
                </Tooltip>
            </h1>

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
                        placeholder="Поиск по имени, email или Telegram ID"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
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