import { useEffect, useState } from 'react';
import { Table, Tag, Select, Button, Popconfirm, message } from 'antd';
import {API_AUTH} from "@/api/axiosWithAuth.js";
const { Option } = Select;

export default function Requests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  const statusColors = {
    new: 'blue',
    in_progress: 'orange',
    done: 'green',
  };

  const statusLabels = {
    new: 'Новая',
    in_progress: 'В процессе',
    done: 'Завершена',
  };

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await API_AUTH.get('applications/applications/');
      setRequests(res.data);
    } catch (err) {
      message.error('Ошибка при загрузке заявок');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await API_AUTH.patch(`applications/applications/${id}/`, { status });
      message.success('Статус обновлён');
      fetchRequests();
    } catch {
      message.error('Ошибка при обновлении статуса');
    }
  };

  const deleteRequest = async (id) => {
    try {
      await API_AUTH.delete(`applications/applications/${id}/`);
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
    { title: 'Имя', dataIndex: 'name', key: 'name' },
    { title: 'Телефон', dataIndex: 'phone', key: 'phone' },
    { title: 'Комментарий', dataIndex: 'comment', key: 'comment' },
    { title: 'Дата', dataIndex: 'created_at', key: 'created_at',
      render: (date) => new Date(date).toLocaleString()
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => (
        <Select
          defaultValue={status}
          style={{ width: 150 }}
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
      <h1 style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>ЗАЯВКИ</h1>
      <Table
        columns={columns}
        dataSource={requests}
        rowKey="id"
        loading={loading}
        pagination={false}
      />
    </>
  );
}
