import {
    Table,
    Select,
    Button,
    Space,
    Popconfirm,
    message,
    Dropdown,
    Spin,
    Modal,
    Input,
    Grid, // Добавляем Grid
    Row,
    Col
  } from 'antd';
  import { useState, useEffect, useMemo } from 'react';
  import { API_AUTH } from '@/utils/api/axiosWithAuth';
  import styles from './AdminLayout.module.css';
  import { 
    EyeOutlined, 
    EyeInvisibleOutlined,
    EditOutlined, 
    DeleteOutlined, 
    MoreOutlined,
    BulbOutlined
  } from '@ant-design/icons'; // Иконки для мобильных действий
  
  const { TextArea } = Input;
  const { useBreakpoint } = Grid; // Хук для определения размера экрана
  
  export default function Listings() {
    const [apartments, setApartments] = useState([]);
    const [statusFilter, setStatusFilter] = useState(null);
    const [loading, setLoading] = useState(false);
    const [rejectingId, setRejectingId] = useState(null);
    const [rejectReason, setRejectReason] = useState('');
    const screens = useBreakpoint(); // Определяем размеры экрана
  
    // Загрузка данных
    const fetchApartments = async () => {
      setLoading(true);
      try {
        const res = await API_AUTH.get('/api/apartment/admin-apartments/');
        setApartments(res.data);
      } catch (err) {
        console.error('Ошибка загрузки:', err);
        message.error('Ошибка загрузки объявлений');
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      fetchApartments();
    }, []);
  
    // Функции обработки (остаются без изменений)
    // ... handleSetStatus, handleSetActive, handleDelete
  
    // Фильтрация данных
    const filtered = useMemo(() => {
      return apartments.filter(item => {
        if (!statusFilter) return true;
        switch (statusFilter) {
          case 'published':
            return item.status === 'approved' && item.is_active;
          case 'draft':
            return item.status === 'approved' && !item.is_active;
          default:
            return item.status === statusFilter;
        }
      });
    }, [apartments, statusFilter]);
  
    // Опции статусов
    const statusOptions = [
      { value: 'pending', label: 'На рассмотрении' },
      { value: 'rejected', label: 'Отклонено' },
      { value: 'published', label: 'Опубликовано' },
      { value: 'draft', label: 'Принято (черновик)' },
    ];
  
    // Адаптивные колонки таблицы
    const columns = useMemo(() => {
      const isMobile = !screens.md;
      
      return [
        {
          title: 'Фото',
          key: 'image',
          width: isMobile ? 60 : 100,
          fixed: 'left',
          render: (_, record) => {
            const image = record.images?.[0]?.image;
            return image ? (
              <img
                src={image}
                alt="preview"
                style={{
                  width: isMobile ? 50 : 100,
                  height: isMobile ? 40 : 75,
                  objectFit: 'cover',
                  borderRadius: 4
                }}
              />
            ) : (
              <div style={{
                width: isMobile ? 50 : 100,
                height: isMobile ? 40 : 75,
                background: '#f0f0f0',
                color: '#888',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 4,
                fontSize: isMobile ? 8 : 12
              }}>
                Нет фото
              </div>
            );
          },
        },
        {
          title: 'Адрес',
          dataIndex: 'address',
          key: 'address',
          width: isMobile ? 120 : 200,
          ellipsis: true,
          render: (text) => (
            <div style={{ 
              maxWidth: '100%', 
              overflow: 'hidden', 
              textOverflow: 'ellipsis', 
              whiteSpace: 'nowrap',
              fontSize: isMobile ? 12 : 14
            }}>
              {isMobile && text.length > 20 
                ? `${text.substring(0, 20)}...` 
                : text}
            </div>
          )
        },
        // Скрываем владельца на мобильных
        ...(isMobile ? [] : [{
          title: 'Владелец',
          key: 'owner',
          width: 180,
          ellipsis: true,
          render: (_, record) => (
            <div style={{ fontSize: 14 }}>
              <div style={{ fontWeight: 'bold', marginBottom: 2 }}>
                {record.owner?.name || '—'}
              </div>
              <div style={{ fontSize: 12, color: '#666' }}>
                {record.owner?.email || '—'}
              </div>
            </div>
          )
        }]),
        // Скрываем дату на мобильных
        ...(isMobile ? [] : [{
          title: 'Дата',
          dataIndex: 'created_at',
          key: 'created_at',
          width: 150,
          ellipsis: true,
          render: (text) => (
            <div style={{ fontSize: 14 }}>
              {new Date(text).toLocaleString('ru-RU', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          ),
        }]),
        {
          title: 'Статус',
          key: 'status',
          width: isMobile ? 80 : 120,
          ellipsis: true,
          render: (_, record) => {
            let statusText;
            let statusColor = '#666';
            
            if (isMobile) {
              // Сокращенные статусы для мобильных
              switch (record.status) {
                case 'pending':
                  statusText = 'На рассмотр.';
                  statusColor = '#faad14';
                  break;
                case 'rejected':
                  statusText = 'Отклонено';
                  statusColor = '#ff4d4f';
                  break;
                case 'approved':
                  statusText = record.is_active ? 'Опубл.' : 'Черновик';
                  statusColor = record.is_active ? '#52c41a' : '#1890ff';
                  break;
                default:
                  statusText = '?';
              }
            } else {
              // Полные статусы для десктопа
              switch (record.status) {
                case 'pending':
                  statusText = 'На рассмотрении';
                  statusColor = '#faad14';
                  break;
                case 'rejected':
                  statusText = 'Отклонено';
                  statusColor = '#ff4d4f';
                  break;
                case 'approved':
                  statusText = record.is_active ? 'Опубликовано' : 'Принято (черновик)';
                  statusColor = record.is_active ? '#52c41a' : '#1890ff';
                  break;
                default:
                  statusText = 'Неизвестно';
              }
            }
            
            return (
              <div style={{ 
                color: statusColor, 
                fontWeight: 'bold',
                fontSize: isMobile ? 10 : 12
              }}>
                {statusText}
              </div>
            );
          }
        },
        {
          title: 'Действия',
          key: 'action',
          width: isMobile ? 80 : 200,
          fixed: 'right',
          render: (_, record) => {
            const statusMenuItems = [
              { key: 'approved', label: 'Принять' },
              { key: 'rejected', label: 'Отклонить' },
              { key: 'pending', label: 'На рассмотрение' },
            ];
  
            const visibilityMenuItems = [
              { key: 'true', label: 'Опубликовать', icon: <EyeOutlined />, disabled: record.is_active },
              { key: 'false', label: 'Снять с публикации', icon: <EyeInvisibleOutlined />, disabled: !record.is_active },
            ];
  
            // Мобильный вид действий
            if (isMobile) {
              const menuItems = [
                {
                  key: 'preview',
                  label: 'Предпросмотр',
                  icon: <EyeOutlined />,
                  onClick: () => window.open(`/listings/${record.id}`, '_blank')
                },
                {
                  key: 'status',
                  label: 'Изменить статус',
                  icon: <EditOutlined />,
                  children: statusMenuItems.map(item => ({
                    ...item,
                    onClick: () => {
                      if (item.key === 'rejected') {
                        setRejectingId(record.id);
                      } else {
                        handleSetStatus(record.id, item.key);
                      }
                    }
                  }))
                },
                ...(record.status === 'approved' ? [{
                  key: 'visibility',
                  label: 'Видимость',
                  icon: record.is_active ? <EyeOutlined /> : <EyeInvisibleOutlined />,
                  children: visibilityMenuItems.map(item => ({
                    ...item,
                    onClick: () => handleSetActive(record.id, item.key === 'true')
                  }))
                }] : []),
                {
                  key: 'delete',
                  label: 'Удалить',
                  icon: <DeleteOutlined />,
                  danger: true,
                  onClick: () => handleDelete(record.id)
                }
              ];
  
              return (
                <Dropdown
                  menu={{ items: menuItems }}
                  trigger={['click']}
                >
                  <Button 
                    icon={<MoreOutlined />} 
                    size="small" 
                    style={{ marginLeft: 8 }}
                  />
                </Dropdown>
              );
            }
  
            // Десктопный вид действий
            return (
              <Space size="small">
                <Button 
                  icon={<EyeOutlined />}
                  onClick={() => window.open(`/listings/${record.id}`, '_blank')}
                  size="small"
                />
                <Dropdown
                  menu={{
                    items: statusMenuItems,
                    onClick: ({ key }) => {
                      if (key === 'rejected') {
                        setRejectingId(record.id);
                      } else {
                        handleSetStatus(record.id, key);
                      }
                    }
                  }}
                >
                  <Button icon={<EditOutlined />} size="small" />
                </Dropdown>
                
                {record.status === 'approved' && (
                  <Dropdown
                    menu={{
                      items: visibilityMenuItems,
                      onClick: ({ key }) => handleSetActive(record.id, key === 'true')
                    }}
                  >
                    <Button icon={record.is_active ? <EyeOutlined /> : <EyeInvisibleOutlined />} size="small" />
                  </Dropdown>
                )}
                
                <Popconfirm
                  title="Удалить объявление?"
                  onConfirm={() => handleDelete(record.id)}
                  okText="Да"
                  cancelText="Нет"
                >
                  <Button 
                    icon={<DeleteOutlined />} 
                    danger 
                    size="small" 
                  />
                </Popconfirm>
              </Space>
            );
          },
        },
      ];
    }, [screens]);
  
    // Карточка объявления для мобильных
    function MobileListingCard({ record, onSetActive, onSetStatus, onSetRejectingId, onDelete }) {
      const image = record.images?.[0]?.image;
      let statusText = '?';
      let statusColor = '#666';
      switch (record.status) {
        case 'pending':
          statusText = 'На рассмотрении'; statusColor = '#faad14'; break;
        case 'rejected':
          statusText = 'Отклонено'; statusColor = '#ff4d4f'; break;
        case 'approved':
          statusText = record.is_active ? 'Опубликовано' : 'Черновик'; statusColor = record.is_active ? '#52c41a' : '#1890ff'; break;
        default:
          statusText = '?';
      }

      // Мобильное меню действий
      const menuItems = [
        {
          key: 'preview',
          label: 'Предпросмотр',
          icon: <EyeOutlined />,
          onClick: () => window.open(`/listings/${record.id}`, '_blank')
        },
        {
          key: 'status',
          label: 'Изменить статус',
          icon: <EditOutlined />,
          children: [
            { key: 'approved', label: 'Принять', onClick: () => onSetStatus(record.id, 'approved') },
            { key: 'rejected', label: 'Отклонить', onClick: () => onSetRejectingId(record.id) },
            { key: 'pending', label: 'На рассмотрение', onClick: () => onSetStatus(record.id, 'pending') },
          ]
        },
        ...(record.status === 'approved' ? [{
          key: 'visibility',
          label: record.is_active ? 'Снять с публикации' : 'Опубликовать',
          icon: record.is_active ? <EyeInvisibleOutlined /> : <EyeOutlined />,
          onClick: () => onSetActive(record.id, !record.is_active)
        }] : []),
        {
          key: 'delete',
          label: 'Удалить',
          icon: <DeleteOutlined />,
          danger: true,
          onClick: () => onDelete(record.id)
        }
      ];

      return (
        <div className={styles.mobileCard}>
          <div className={styles.mobileCardImageBox}>
            {image ? (
              <img src={image} alt="preview" className={styles.mobileCardImage} />
            ) : (
              <div className={styles.mobileCardNoImage}>Нет фото</div>
            )}
          </div>
          <div className={styles.mobileCardContent}>
            <div className={styles.mobileCardAddress}>{record.address}</div>
            <div className={styles.mobileCardStatus} style={{ color: statusColor }}>{statusText}</div>
            <div className={styles.mobileCardOwner}>{record.owner?.name || '—'}</div>
            <div className={styles.mobileCardDate}>{new Date(record.created_at).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
            <div className={styles.mobileCardActions}>
              <Dropdown menu={{ items: menuItems }} trigger={['click']}>
                <Button icon={<MoreOutlined />} size="small" />
              </Dropdown>
            </div>
          </div>
        </div>
      );
    }
  
    // --- ДОБАВЛЯЕМ ОБРАБОТЧИКИ ---
    const handleSetStatus = async (id, status, reason = '') => {
      setLoading(true);
      try {
        await API_AUTH.patch(`/api/apartment/admin-apartments/${id}/set_status/`, {
          status,
          rejection_reason: reason,
        });
        message.success('Статус обновлен');
        fetchApartments();
      } catch (err) {
        message.error('Ошибка при обновлении статуса');
      } finally {
        setLoading(false);
      }
    };

    const handleSetActive = async (id, isActive) => {
      setLoading(true);
      try {
        await API_AUTH.patch(`/api/apartment/admin-apartments/${id}/set_active/`, {
          is_active: isActive,
        });
        message.success(isActive ? 'Объявление опубликовано' : 'Снято с публикации');
        fetchApartments();
      } catch (err) {
        message.error('Ошибка при изменении видимости');
      } finally {
        setLoading(false);
      }
    };

    const handleDelete = async (id) => {
      setLoading(true);
      try {
        await API_AUTH.delete(`/api/apartment/admin-apartments/${id}/`);
        message.success('Объявление удалено');
        fetchApartments();
      } catch (err) {
        message.error('Ошибка при удалении');
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <div className={styles.adminContainer}>
        <div className={styles.adminHeader}>
          <h1>ОБЪЯВЛЕНИЯ</h1>
        </div>
        
        {/* Адаптивный фильтр */}
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col xs={24} md={12} lg={8} xl={6}>
            <Select
              placeholder="Все статусы"
              onChange={setStatusFilter}
              allowClear
              style={{ width: '100%' }}
              options={statusOptions}
              size={screens.xs ? 'small' : 'middle'}
            />
          </Col>
        </Row>
        
        <Spin spinning={loading}>
          {screens.md === false ? (
            <div className={styles.mobileCardsList}>
              {filtered.length === 0 ? (
                <div className={styles.mobileNoResults}>Нет объявлений</div>
              ) : (
                filtered.map((record) => (
                  <MobileListingCard
                    key={record.id}
                    record={record}
                    onSetActive={(id, isActive) => handleSetActive(id, isActive)}
                    onSetStatus={(id, status) => handleSetStatus(id, status)}
                    onSetRejectingId={setRejectingId}
                    onDelete={handleDelete}
                  />
                ))
              )}
            </div>
          ) : (
            <Table
              columns={columns}
              dataSource={filtered}
              rowKey="id"
              scroll={{ x: 1200, y: '60vh' }}
              size={screens.xs ? 'small' : 'middle'}
              pagination={{
                size: screens.xs ? 'small' : 'default',
                showSizeChanger: !screens.xs,
                showQuickJumper: !screens.xs,
                showTotal: !screens.xs ? (total, range) =>
                  `${range[0]}-${range[1]} из ${total} объявлений` : undefined,
                pageSize: screens.xs ? 5 : 10,
                pageSizeOptions: screens.xs ? ['5', '10'] : ['10', '20', '50']
              }}
              className={styles.responsiveTable}
            />
          )}
        </Spin>
  
        <Modal
          title="Причина отклонения"
          open={rejectingId !== null}
          onOk={() => {
            if (rejectingId) handleSetStatus(rejectingId, 'rejected', rejectReason);
            setRejectingId(null);
            setRejectReason('');
          }}
          onCancel={() => {
            setRejectingId(null);
            setRejectReason('');
          }}
          okText="Подтвердить"
          cancelText="Отмена"
          width={screens.xs ? '90%' : 500}
          centered
        >
          <TextArea
            rows={4}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Причина отклонения (необязательно)"
            maxLength={500}
            showCount
          />
        </Modal>
      </div>
    );
  }