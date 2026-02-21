import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState({});

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/analytics');
        setStats(res.data.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="admin-panel">
      <div className="sidebar">
        <h3>Admin Panel</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li><Link to="/admin/users">User Management</Link></li>
          <li><Link to="/admin/products">Product Management</Link></li>
          <li><Link to="/admin/orders">Order Management</Link></li>
          <li><Link to="/admin/analytics">Sales Analytics</Link></li>
        </ul>
      </div>
      <div className="content">
        <h2>Dashboard Overview</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
          <div className="card">
            <h4>Total Users</h4>
            <p>{stats.totalUsers || 0}</p>
          </div>
          <div className="card">
            <h4>Total Products</h4>
            <p>{stats.totalProducts || 0}</p>
          </div>
          <div className="card">
            <h4>Total Orders</h4>
            <p>{stats.totalOrders || 0}</p>
          </div>
          <div className="card">
            <h4>Total Revenue</h4>
            <p>${stats.totalRevenue || 0}</p>
