import { Table, Select, Button, Space } from 'antd';
import { useState } from 'react';

const { Option } = Select;

const data = [
  { key: 1, title: '2-к квартира, 45 м²', owner: 'Иван', date: '22.04.2024', status: 'Опубликовано' },
  { key: 2, title: 'Студия, 30 м²', owner: 'Мария', date: '21.04.2024', status: 'Черновик' },
  { key: 3, title: '3-к квартира, 60 м²', owner: 'Алексей', date: '20.04.2024', status: 'Опубликовано' },
  { key: 4, title: '1-к квартира, 35 м²', owner: 'Ольга', date: '18.04.2024', status: 'Архив' },
];

export default function Listings() {
  const [statusFilter, setStatusFilter] = useState(null);

  const handleStatusChange = value => setStatusFilter(value);

  const filteredData = data.filter(item => !statusFilter || item.status === statusFilter);

  const columns = [
    { title: 'Название', dataIndex: 'title', key: 'title' },
    { title: 'Владелец', dataIndex: 'owner', key: 'owner' },
    { title: 'Дата добавления', dataIndex: 'date', key: 'date' },
    { title: 'Статус', dataIndex: 'status', key: 'status' },
    {
      title: '',
      key: 'action',
      render: (_, record) => (
        <Button type="primary">
          {record.status === 'Опубликовано' ? 'Скрыть' : 'Опубликовать'}
        </Button>
      ),
    },
  ];

  return (
    <>
      <h1 style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>ОБЪЯВЛЕНИЯ</h1>
      <Space style={{ marginBottom: 16 }}>
        <Select
          placeholder="Все статусы"
          onChange={handleStatusChange}
          allowClear
          style={{ width: 180 }}
        >
          <Option value="Опубликовано">Опубликовано</Option>
          <Option value="Черновик">Черновик</Option>
          <Option value="Архив">Архив</Option>
        </Select>
      </Space>
      <Table columns={columns} dataSource={filteredData} pagination={false} />
    </>
  );
}
