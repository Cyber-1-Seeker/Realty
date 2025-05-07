import {Layout, Menu} from 'antd';
import {useState} from 'react';
import {
    FileTextOutlined,
    HomeOutlined,
    BarChartOutlined,
    UserOutlined
} from '@ant-design/icons';

import Requests from './Requests';
import Listings from './Listings';
import Analytics from './Analytics';
import Users from './Users';

const {Header, Sider, Content} = Layout;

export default function AdminLayout() {
    const [selectedKey, setSelectedKey] = useState('requests');

    const renderContent = () => {
        switch (selectedKey) {
            case 'requests': return <Requests/>;
            case 'listings': return <Listings/>;
            case 'analytics': return <Analytics />;
            case 'users': return <Users />;
            default:
                return <Requests/>;
        }
    };

    return (
        <Layout style={{minHeight: '100vh'}}>
            <Sider>
                <div style={{color: 'white', fontWeight: 'bold', fontSize: 18, padding: 16}}>
                    АДМИН-ПАНЕЛЬ
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[selectedKey]}
                    onClick={({key}) => setSelectedKey(key)}
                    items={[
                        {key: 'requests', icon: <FileTextOutlined/>, label: 'Заявки'},
                        {key: 'listings', icon: <HomeOutlined/>, label: 'Объявления'},
                        {key: 'analytics', icon: <BarChartOutlined/>, label: 'Аналитика'},
                        {key: 'users', icon: <UserOutlined/>, label: 'Пользователи'}
                    ]}
                />
            </Sider>
            <Layout>
                <Header style={{background: '#fff', textAlign: 'right', paddingRight: 20}}>
                    <a href="/logout">Выйти</a>
                </Header>
                <Content style={{margin: '24px 16px', background: '#fff', padding: 24}}>
                    {renderContent()}
                </Content>
            </Layout>
        </Layout>
    );
}
