import React, { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import HeaderMenu from "./headerMenu";
import { Menu, Button } from "antd";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
import "../assets/scss/layout.scss";

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [collapsed, setCollapsed] = useState(true);

  const handleResize = () => setIsMobile(window.innerWidth <= 768);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuItems = [
    { key: "/dashboard", label: "Dashboard" },
    { key: "/products", label: "Ürünler" },
    { key: "/costs", label: "Maliyetler" },
    { key: "/costcalculation", label: "Maliyet Hesaplama" }, // yeni link
  ];

  return (
    <div className="app-layout">
      {/* Header her zaman görünür */}
      <HeaderMenu />

      <div className="layout-body">
        {/* Desktop sidebar sadece desktopta */}
        {!isMobile && (
          <div className={`sidebar ${collapsed ? "collapsed" : "expanded"}`}>
            <Menu
              mode="inline"
              selectedKeys={[location.pathname]}
              onClick={(e) => navigate(e.key)}
              items={menuItems}
              style={{ height: "calc(100vh - 64px)", borderRight: 0 }}
            />

            <div className="collapse-btn-wrapper">
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
              />
            </div>
          </div>
        )}

        {/* Page content */}
        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
