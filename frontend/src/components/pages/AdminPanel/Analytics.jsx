import {useEffect, useState} from 'react';
import {Card, Col, Row, Statistic, Select, Spin} from 'antd';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {API_AUTH} from '@/utils/api/axiosWithAuth';

const {Option} = Select;

const METRIC_OPTIONS = [
    {key: 'visits', label: 'Визиты'},
    {key: 'new_visits', label: 'Новые визиты'},
    {key: 'new_registers', label: 'Регистрации'},
    {key: 'new_applications', label: 'Заявки'}
];

const PERIOD_OPTIONS = [
    {key: 'day', label: 'Сегодня'},
    {key: 'week', label: 'Неделя'},
    {key: 'month', label: 'Месяц'},
    {key: 'year', label: 'Год'}
];

export default function Analytics() {
    const [metric, setMetric] = useState('visits');
    const [period, setPeriod] = useState('week');
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    // Загрузка данных
    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await API_AUTH.get('/api/monitoring/daily/', {

                params: {
                    period,
                    type: metric
                }
            });
            setData(res.data.data || []);
            setTotal(res.data.total || 0);
        } catch (err) {
            console.error('Ошибка при загрузке аналитики:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [metric, period]);

    return (
        <>
            <h1 style={{fontSize: 24, fontWeight: 'bold', marginBottom: 24}}>АНАЛИТИКА</h1>

            <Row gutter={16} style={{marginBottom: 24}}>
                {METRIC_OPTIONS.map((item) => (
                    <Col xs={24} sm={12} md={6} key={item.key} onClick={() => setMetric(item.key)}>
                        <Card
                            hoverable
                            variant={metric === item.key ? "outlined" : "borderless"}
                        >
                            <Statistic
                                title={item.label}
                                value={metric === item.key ? total : '—'}
                            />
                        </Card>
                    </Col>
                ))}
            </Row>

            <Row justify="end" style={{marginBottom: 16}}>
                <Select value={period} onChange={setPeriod} style={{width: 150}}>
                    {PERIOD_OPTIONS.map((p) => (
                        <Option value={p.key} key={p.key}>{p.label}</Option>
                    ))}
                </Select>
            </Row>

            <Card title={`График: ${METRIC_OPTIONS.find(m => m.key === metric).label}`}>
                {loading ? (
                    <Spin/>
                ) : (
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3"/>
                            <XAxis dataKey="date"/>
                            <YAxis allowDecimals={false}/>
                            <Tooltip/>
                            <Line type="monotone" dataKey="value" stroke="#1890ff" strokeWidth={2}/>
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </Card>
        </>
    );
}
