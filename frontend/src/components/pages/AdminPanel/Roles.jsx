import { useEffect, useState } from 'react';
import { Table, Button, Select, message, Spin } from 'antd';
import { API_AUTH } from '@/utils/api/axiosWithAuth';

const roleLabels = {
  admin: 'Админ',
  manager: 'Менеджер',
  moderator: 'Модератор',
};

export default function Roles() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await API_AUTH.get('/api/accounts/users/');
      setUsers(res.data);
    } catch {
      message.error('Ошибка при загрузке пользователей');
    } finally {
      setLoading(false);
    }
  };

  const updateRole = async (id, role) => {
    try {
      await API_AUTH.patch(`/api/accounts/users/${id}/`, { role });
      message.success('Роль обновлена');
      fetchUsers();
    } catch {
      message.error('Ошибка при обновлении роли');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const columns = [
    { title: 'Имя', dataIndex: 'first_name', key: 'first_name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    {
      title: 'Роль',
      key: 'role',
      render: (_, record) => (
        <Select
          value={record.role}
          onChange={(value) => updateRole(record.id, value)}
          style={{ width: 150 }}
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
      <h1 style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>УПРАВЛЕНИЕ РОЛЯМИ</h1>
      {loading ? (
        <div style={{ textAlign: 'center', padding: 40 }}><Spin size="large" /></div>
      ) : (
        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          pagination={false}
          scroll={{ x: true }}
        />
      )}
    </>
  );
}
