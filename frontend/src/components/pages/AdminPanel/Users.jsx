import {useEffect, useState} from 'react';
import {Table, Button, Popconfirm, Switch, message} from 'antd';
import {API_AUTH} from '@/api/axiosWithAuth';

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    // Получение списка пользователей с добавлением нумерации
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await API_AUTH.get('accounts/users/');
            // Добавляем поле index для вывода "№" в таблице
            const indexed = res.data.map((user, idx) => ({
                ...user,
                index: res.data.length - idx,
            }));
            setUsers(indexed);
        } catch {
            message.error('Ошибка при загрузке пользователей');
        } finally {
            setLoading(false);
        }
    };

    // Изменение активности пользователя (вкл/выкл)
    const toggleActive = async (id, isActive) => {
        try {
            await API_AUTH.patch(`accounts/users/${id}/`, {is_active: isActive});
            message.success('Статус пользователя обновлён');
            fetchUsers();
        } catch {
            message.error('Ошибка при обновлении статуса');
        }
    };

    // Удаление пользователя из системы
    const deleteUser = async (id) => {
        try {
            await API_AUTH.delete(`accounts/users/${id}/`);
            message.success('Пользователь удалён');
            fetchUsers();
        } catch {
            message.error('Ошибка при удалении пользователя');
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const columns = [
        {
            title: '№',
            dataIndex: 'index',
            key: 'index',
            width: 50,
        },
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
                >
                    <Button danger>Удалить</Button>
                </Popconfirm>
            ),
        },
    ];

    return (
        <>
            <h1 style={{fontSize: 24, fontWeight: 'bold', marginBottom: 16}}>ПОЛЬЗОВАТЕЛИ</h1>
            <Table
                columns={columns}
                dataSource={users}
                rowKey="id"
                loading={loading}
                pagination={false}
            />
        </>
    );
}
