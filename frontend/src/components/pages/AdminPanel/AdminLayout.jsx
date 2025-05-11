import {Layout, Menu, Grid, Button, Drawer} from 'antd';
import {useState} from 'react';
import {
    FileTextOutlined,
    HomeOutlined,
    BarChartOutlined,
    UserOutlined,
    MenuOutlined
} from '@ant-design/icons';

import Requests from './Requests';
import Listings from './Listings';
import Analytics from './Analytics';
import Users from './Users';

const {Header, Sider, Content} = Layout;
const {useBreakpoint} = Grid;

export default function AdminLayout() {
    const [selectedKey, setSelectedKey] = useState('requests');
    const [drawerVisible, setDrawerVisible] = useState(false);
    const screens = useBreakpoint();

    const renderContent = () => {
        switch (selectedKey) {
            case 'requests':
                return <Requests/>;
            case 'listings':
                return <Listings/>;
            case 'analytics':
                return <Analytics/>;
            case 'users':
                return <Users/>;
            default:
                return <Requests/>;
        }
    };

    const menuItems = [
        {key: 'requests', icon: <FileTextOutlined/>, label: 'Заявки'},
        {key: 'listings', icon: <HomeOutlined/>, label: 'Объявления'},
        {key: 'analytics', icon: <BarChartOutlined/>, label: 'Аналитика'},
        {key: 'users', icon: <UserOutlined/>, label: 'Пользователи'}
    ];

    return (
        <Layout style={{minHeight: '100vh'}}>
            {!screens.md ? (
                <>
                    <Drawer
                        title={
                            <div style={{fontWeight: 'bold', fontSize: 18}}>
                                АДМИН-ПАНЕЛЬ
                            </div>
                        }
                        placement="left"
                        onClose={() => setDrawerVisible(false)}
                        open={drawerVisible}
                        bodyStyle={{padding: 0}}
                    >

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
                </>
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
                    padding: '0 16px'
                }}>
                    {!screens.md && (
                        <Button icon={<MenuOutlined/>} onClick={() => setDrawerVisible(true)}/>
                    )}
                    <a href="/logout">Выйти</a>
                </Header>
                <Content
                    style={{
                        margin: '16px',
                        background: '#fff',
                        padding: screens.xs ? 8 : 16,  // адаптивный padding
                        borderRadius: 8,
                        boxShadow: '0 0 8px rgba(0,0,0,0.05)',
                    }}
                >
                    {renderContent()}
                </Content>
            </Layout>
        </Layout>
    );
}
