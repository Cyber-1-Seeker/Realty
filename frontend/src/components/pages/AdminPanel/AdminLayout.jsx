import {useEffect, useState, useRef, useCallback} from 'react';
import {useNavigate} from 'react-router-dom';
import {Layout, Menu, Grid, Button, Drawer, Spin, message, Alert} from 'antd';
import {
    FileTextOutlined,
    HomeOutlined,
    BarChartOutlined,
    CommentOutlined,
    UserOutlined,
    MenuOutlined,
    LoadingOutlined
} from '@ant-design/icons';
import {API_AUTH} from "@/utils/api/axiosWithAuth.js";

// Импортируем компоненты
import Requests from './Requests';
import Listings from './Listings';
import Analytics from './Analytics';
import AdminTestimonials from './AdminTestimonials.jsx'
import Users from './Users';
import Roles from './Roles.jsx';

const {Header, Sider, Content} = Layout;
const {useBreakpoint} = Grid;

// Кастомная иконка для лоадера
const antIcon = <LoadingOutlined style={{fontSize: 48}} spin/>;

export default function AdminLayout() {
    const [selectedKey, setSelectedKey] = useState('requests');
    const [drawerVisible, setDrawerVisible] = useState(false);
    const screens = useBreakpoint();
    const [accessGranted, setAccessGranted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const errorShownRef = useRef(false); // Используем ref вместо state

    const showError = useCallback((err) => {
        const serverError = err.response?.data;
        const errorMessage =
            serverError?.detail ||
            serverError?.non_field_errors?.[0] ||
            serverError?.error ||
            err.message ||
            'Ошибка сервера';

        if (!errorShownRef.current) {
            errorShownRef.current = true;
            message.error({
                content: errorMessage,
                duration: 2,
                onClose: () => {
                    errorShownRef.current = false;
                }
            });
            console.error('Детали ошибки:', serverError);
        }
    }, []);

    useEffect(() => {
        const checkAdminAccess = async () => {
            try {
                const response = await API_AUTH.get('/api/accounts/admin/check-access/');
                if (response.data) {
                    setAccessGranted(true);
                }
            } catch (error) {
                setError(error);
                showError(error); // Используем общий обработчик
                navigate('/');
            } finally {
                setLoading(false);
            }
        };

        checkAdminAccess();
    }, [navigate, showError]);

    // Стилизованный лоадер
    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                flexDirection: 'column',
                gap: 20
            }}>
                <Spin indicator={antIcon}/>
                <p style={{fontSize: 18, color: '#1890ff'}}>Загрузка админ-панели...</p>
            </div>
        );
    }

    // Компонент ошибки
    if (error) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                padding: 20
            }}>
                <Alert
                    message="Ошибка доступа"
                    description={error.response?.data?.detail || 'У вас нет прав доступа к админ-панели'}
                    type="error"
                    showIcon
                    style={{maxWidth: 500}}
                />
            </div>
        );
    }

    if (!accessGranted) {
        return null;
    }

    const renderContent = () => {
        const components = {
            'requests': <Requests onError={showError}/>,
            'listings': <Listings onError={showError}/>,
            'analytics': <Analytics onError={showError}/>,
            'testimonials': <AdminTestimonials onError={showError}/>,
            'users': <Users onError={showError}/>,
            'roles': <Roles onError={showError}/>
        };

        return components[selectedKey] || <Requests onError={showError}/>;
    };

    const menuItems = [
        {key: 'requests', icon: <FileTextOutlined/>, label: 'Заявки'},
        {key: 'listings', icon: <HomeOutlined/>, label: 'Объявления'},
        {key: 'analytics', icon: <BarChartOutlined/>, label: 'Аналитика'},
        {key: 'testimonials', icon: <CommentOutlined/>, label: 'Отзывы'},
        {key: 'users', icon: <UserOutlined/>, label: 'Пользователи'},
        {key: 'roles', icon: <UserOutlined/>, label: 'Роли'},
    ];

    return (
        <Layout style={{minHeight: '100vh'}}>
            {/* Мобильное меню */}
            {!screens.md ? (
                <Drawer
                    title={<div style={{fontWeight: 'bold', fontSize: 18}}>АДМИН-ПАНЕЛЬ</div>}
                    placement="left"
                    onClose={() => setDrawerVisible(false)}
                    open={drawerVisible}
                    styles={{body: {padding: 0}}}>
                    <Menu
                        mode="inline"
                        selectedKeys={[selectedKey]}
                        onClick={({key}) => {
                            setSelectedKey(key);
                            setDrawerVisible(false);
                        }}
                        items={menuItems.map((item) => ({
                            ...item,
                            label: <span style={{fontSize: 16, padding: '6px 0'}}>{item.label}</span>,
                        }))}
                    />
                </Drawer>
            ) : (
                <Sider breakpoint="md" collapsedWidth="0">
                    <div style={{color: 'white', fontWeight: 'bold', fontSize: 18, padding: 16}}>
                        АДМИН-ПАНЕЛЬ
                    </div>
                    <Menu
                        theme="dark"
                        mode="inline"
                        selectedKeys={[selectedKey]}
                        onClick={({key}) => setSelectedKey(key)}
                        items={menuItems}
                    />
                </Sider>
            )}

            <Layout>
                <Header style={{
                    background: '#fff',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0 16px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                    {!screens.md && (
                        <Button
                            icon={<MenuOutlined/>}
                            onClick={() => setDrawerVisible(true)}
                            style={{border: 'none', boxShadow: 'none'}}
                        />
                    )}
                    <Button type="text" danger onClick={() => navigate('/')}>
                        На главную
                    </Button>
                </Header>
                <Content
                    style={{
                        margin: '16px',
                        background: '#fff',
                        padding: screens.xs ? 16 : 24,
                        borderRadius: 8,
                        boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                        minHeight: 'calc(100vh - 64px - 32px)'
                    }}
                >
                    {renderContent()}
                </Content>
            </Layout>
        </Layout>
    );
}