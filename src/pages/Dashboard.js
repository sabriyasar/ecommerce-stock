import React from 'react';
import { Typography } from 'antd';
import '../assets/scss/dashboard.scss';  // SCSS dosyasını import ettik

const { Title } = Typography;

const Dashboard = () => {
  return (
    <div>
      <Title level={2}>Merhaba, Hoş Geldin</Title>
      <p>Hemen ürünlerini kontrol et.</p>
    </div>
  );
};

export default Dashboard;
