import {useState, useEffect} from 'react';
import {Table, Button, Switch, Input, message, Spin, Row, Col, Tooltip} from 'antd';
import {DeleteOutlined, PlusOutlined, EyeOutlined} from '@ant-design/icons';
import {API_AUTH} from '@/utils/api/axiosWithAuth';

export default function AdminTestimonials({onError}) {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newName, setNewName] = useState('');
    const [newText, setNewText] = useState('');

    const fetchTestimonials = async () => {
        setLoading(true);
        try {
            const res = await API_AUTH.get('/api/testimonials/testimonials/');
            setTestimonials(res.data);
        } catch (error) {
            onError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const addTestimonial = async () => {
        if (!newName.trim() || !newText.trim()) {
            message.warning('Заполните все поля');
            return;
        }

        if (newName.length > 50) {
            message.warning('Имя не должно превышать 50 символов');
            return;
        }

        try {
            await API_AUTH.post('/api/testimonials/testimonials/', {
                name: newName,
                text: newText,
                is_active: true
            });
            message.success('Отзыв добавлен');
            setNewName('');
            setNewText('');
            fetchTestimonials();
        } catch (error) {
            onError(error);
        }
    };

    const toggleActive = async (id, isActive) => {
        try {
            await API_AUTH.patch(`/api/testimonials/testimonials/${id}/`, {
                is_active: !isActive
            });
            message.success('Статус обновлен');
            fetchTestimonials();
        } catch (error) {
            onError(error);
        }
    };

    const deleteTestimonial = async (id) => {
        try {
            await API_AUTH.delete(`/api/testimonials/testimonials/${id}/`);
            message.success('Отзыв удален');
            fetchTestimonials();
        } catch (error) {
            onError(error);
        }
    };

    const columns = [
        {
            title: 'Имя',
            dataIndex: 'name',
            key: 'name',
            width: 150,
            render: name => <div className="admin-cell">{name}</div>
        },
        {
            title: 'Текст отзыва',
            dataIndex: 'text',
            key: 'text',
            render: text => (
                <div className="admin-cell" style={{
                    maxHeight: 100,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical'
                }}>
                    {text}
                </div>
            )
        },
        {
            title: 'Дата создания',
            dataIndex: 'created_at',
            key: 'created_at',
            width: 150,
            render: date => new Date(date).toLocaleDateString('ru-RU')
        },
        {
            title: 'Статус',
            dataIndex: 'is_active',
            key: 'is_active',
            width: 100,
            render: (isActive, record) => (
                <Switch
                    checked={isActive}
                    onChange={() => toggleActive(record.id, isActive)}
                    checkedChildren="Вкл"
                    unCheckedChildren="Выкл"
                />
            )
        },
        {
            title: 'Действия',
            key: 'actions',
            width: 120,
            render: (_, record) => (
                <div style={{display: 'flex', gap: 8}}>
                    <Tooltip title="Просмотреть полностью">
                        <Button
                            icon={<EyeOutlined/>}
                            onClick={() => {
                                message.info(
                                    <div style={{padding: 20, background: '#f0f4f8', borderRadius: 8}}>
                                        <div style={{fontWeight: 600, marginBottom: 10}}>{record.name}</div>
                                        <div style={{fontStyle: 'italic'}}>{record.text}</div>
                                    </div>,
                                    5);
                            }}
                        />
                    </Tooltip>
                    <Tooltip title="Удалить">
                        <Button
                            danger
                            icon={<DeleteOutlined/>}
                            onClick={() => deleteTestimonial(record.id)}
                        />
                    </Tooltip>
                </div>
            )
        }
    ];

    return (
        <div className="admin-container">
            <h1 className="admin-title">
                Управление отзывами
                <span className="admin-subtitle">Только активные отзывы отображаются на сайте</span>
            </h1>

            <div className="admin-card">
                <h3 className="admin-card-title">Добавить новый отзыв</h3>
                <Row gutter={[16, 16]}>
                    <Col span={24}>
                        <Input
                            placeholder="Имя клиента (макс. 50 символов)"
                            value={newName}
                            onChange={e => setNewName(e.target.value)}
                            maxLength={50}
                            showCount
                        />
                    </Col>
                    <Col span={24}>
                        <Input.TextArea
                            placeholder="Текст отзыва"
                            value={newText}
                            onChange={e => setNewText(e.target.value)}
                            rows={4}
                            style={{resize: 'vertical'}}
                        />
                    </Col>
                    <Col>
                        <Button
                            type="primary"
                            icon={<PlusOutlined/>}
                            onClick={addTestimonial}
                            style={{minWidth: 120}}
                        >
                            Добавить отзыв
                        </Button>
                    </Col>
                </Row>
            </div>

            {loading ? (
                <div className="admin-loading">
                    <Spin size="large"/>
                    <p>Загрузка отзывов...</p>
                </div>
            ) : (
                <Table
                    columns={columns}
                    dataSource={testimonials}
                    rowKey="id"
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: false,
                        hideOnSinglePage: true
                    }}
                    scroll={{x: true}}
                    className="admin-table"
                />
            )}
        </div>
    );
}