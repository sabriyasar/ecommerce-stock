// src/routes/Routing.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Products from "../pages/Products";
import AddNewProduct from "../pages/AddNewProduct";
import EditProduct from "../pages/EditProduct";
import Layout from "../components/Layout";
import Costs from "../pages/Costs";
import AddNewCost from "../pages/addNewCost";
import EditCost from "../pages/EditCost";
import CostCalculation from "../pages/CostCalculation";

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
          <Route path="/costs" element={<Costs />} />
          <Route path="/addnewcost" element={<AddNewCost />} />
          <Route path="/editcost/:id" element={<EditCost />} />
          <Route path="/costcalculation" element={<CostCalculation />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default Routing;
