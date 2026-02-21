import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminDashboard from '../components/AdminDashboard';
import UserManagement from '../components/UserManagement';
import ProductManagement from '../components/ProductManagement';
import OrderManagement from '../components/OrderManagement';
import SalesAnalytics from '../components/SalesAnalytics';

const AdminPanel = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminDashboard />} />
      <Route path="/users" element={<UserManagement />} />
      <Route path="/products" element={<ProductManagement />} />
      <Route path="/orders" element={<OrderManagement />} />
      <Route path="/analytics" element={<SalesAnalytics />} />
    </Routes>
  );
};

export default AdminPanel;
