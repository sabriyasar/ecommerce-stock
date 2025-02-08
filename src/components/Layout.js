import React, { useState } from 'react';
import { Layout, Menu, Button } from 'antd';
import { DashboardOutlined, ShoppingCartOutlined, MenuOutlined } from '@ant-design/icons';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import '../assets/scss/styles.scss';  // SCSS dosyasını import ettik

const { Sider, Content } = Layout;

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate(); // useNavigate hook'u

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const handleLogout = () => {
    // Çıkış yapma işlemleri buraya eklenebilir
    console.log('Çıkış yapıldı');
    navigate('/login');  // Login sayfasına yönlendirme
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Sol Sidebar */}
      <Sider
        width={200}
        className="site-layout-background"
        collapsed={collapsed}
        trigger={null}
        collapsible
      >
        <Button
          type="text"
          icon={<MenuOutlined />}
          onClick={toggleSidebar}
          className="menu-toggle-button"
          style={{ position: 'absolute', top: 16, left: 16 }}
        />
        <Menu
          mode="inline"
          defaultSelectedKeys={['1']}
          style={{ height: '100%', borderRight: 0 }}
        >
          <Menu.Item key="1" icon={<DashboardOutlined />}>
            <Link to="/dashboard">Dashboard</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<ShoppingCartOutlined />}>
            <Link to="/products">Ürünler</Link>
          </Menu.Item>
        </Menu>
        {/* Çıkış Yap Butonu */}
        <Button
          type="primary"
          danger
          onClick={handleLogout}
          style={{
            position: 'absolute',
            bottom: 16,
            left: 16,
            width: 'calc(100% - 32px)',
          }}
        >
          Çıkış Yap
        </Button>
      </Sider>

      {/* Sağ İçerik Alanı */}
      <Layout style={{ padding: '24px' }}>
        <Content style={{ padding: 24, margin: 0, minHeight: 280 }}>
          <Outlet /> {/* Route'a göre içerik değişecek kısım */}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
