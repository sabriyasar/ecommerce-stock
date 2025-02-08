import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Products from '../pages/Products';
import AddNewProduct from '../pages/AddNewProduct'; // Yeni ürün ekleme sayfası
import EditProduct from '../pages/EditProduct'; // Ürün düzenleme sayfası
import MainLayout from '../components/Layout'; // Sidebar içeriyor

const Routing = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        
        {/* Layout içinde Dashboard, Products ve AddNewProduct gösterilecek */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/addnewproducts" element={<AddNewProduct />} /> {/* Yeni Ürün Sayfası */}
          <Route path="/editproduct/:id" element={<EditProduct />} /> {/* Ürün Düzenleme Sayfası */}
        </Route>
      </Routes>
    </Router>
  );
};

export default Routing;
