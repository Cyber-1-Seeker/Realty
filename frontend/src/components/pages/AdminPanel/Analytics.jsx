import { Card, Col, Row, Statistic } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const stats = [
  { title: 'Заявки', value: 123 },
  { title: 'Объявления', value: 56 },
  { title: 'Пользователи', value: 34 },
  { title: 'Просмотры', value: 2043 }
];

const viewsData = [
  { date: '01.05', views: 120 },
  { date: '02.05', views: 210 },
  { date: '03.05', views: 350 },
  { date: '04.05', views: 300 },
  { date: '05.05', views: 390 },
  { date: '06.05', views: 470 },
];

export default function Analytics() {
  return (
    <>
      <h1 style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 24 }}>АНАЛИТИКА</h1>

      <Row gutter={16} style={{ marginBottom: 32 }}>
        {stats.map((stat, index) => (
          <Col span={6} key={index}>
            <Card>
              <Statistic title={stat.title} value={stat.value} />
            </Card>
          </Col>
        ))}
      </Row>

      <Card title="Просмотры за неделю">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={viewsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="views" stroke="#1890ff" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </>
  );
}
