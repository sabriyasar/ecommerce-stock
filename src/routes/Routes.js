// src/routes/Routing.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Products from "../pages/Products";
import AddNewProduct from "../pages/AddNewProduct";
import EditProduct from "../pages/EditProduct";
import Layout from "../components/Layout";

const Routing = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />

        {/* Layout içinde header menü olacak */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/addnewproducts" element={<AddNewProduct />} />
          <Route path="/editproduct/:id" element={<EditProduct />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default Routing;
