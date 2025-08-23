import React, { useState, useEffect } from "react";
import { Button, Drawer, Menu, Divider } from "antd";
import { MenuOutlined, LogoutOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import "../assets/scss/menu.scss";

const HeaderMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);

  const menuItems = [
    { key: "/dashboard", label: "Dashboard" },
    { key: "/products", label: "Ürünler" },
    { key: "/addnewproducts", label: "Yeni Ürün Ekle" },
    { key: "/costs", label: "Maliyetler" },
  ];

  const handleResize = () => setIsMobile(window.innerWidth <= 768);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    console.log("Çıkış yapıldı");
    navigate("/login");
  };

  const drawerMenu = (
    <div className="drawer-menu">
      <div
        className="drawer-logo"
        onClick={() => {
          navigate("/dashboard");
          setDrawerVisible(false);
        }}
      >
        3D Atelier Stok Paneli
      </div>
      <Divider style={{ margin: 0 }} />
      <Menu
        onClick={(e) => {
          navigate(e.key);
          setDrawerVisible(false);
        }}
        selectedKeys={[location.pathname]}
        mode="vertical"
      >
        {menuItems.map((item) => (
          <Menu.Item key={item.key}>{item.label}</Menu.Item>
        ))}
      </Menu>
    </div>
  );

  return (
    <div className="header-menu">
      {isMobile && (
        <Button
          icon={<MenuOutlined />}
          onClick={() => setDrawerVisible(true)}
          className="mobile-toggle"
        />
      )}

      <div className="logo" onClick={() => navigate("/dashboard")}>
        3D Atelier Stok Paneli
      </div>

      {/* Masaüstünde sadece Çıkış butonu sağ üstte */}
      {!isMobile && (
        <div className="desktop-logout">
          <Button
            type="primary"
            icon={<LogoutOutlined />}
            onClick={handleLogout}
          >
            Çıkış
          </Button>
        </div>
      )}

      {/* Mobil drawer */}
      {isMobile && (
        <Drawer
          placement="left"
          closable={true}
          onClose={() => setDrawerVisible(false)}
          visible={drawerVisible}
          bodyStyle={{ padding: 0, height: "100%" }}
          drawerStyle={{ animation: "slideIn 0.3s ease" }}
        >
          {drawerMenu}
          <Divider style={{ margin: 0 }} />
          <Button
            type="text"
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            block
          >
            Çıkış
          </Button>
        </Drawer>
      )}
    </div>
  );
};

export default HeaderMenu;
