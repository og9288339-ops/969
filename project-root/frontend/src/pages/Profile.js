import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../utils/api';

const Profile = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (user) {
        try {
          const res = await api.get('/orders');
          setOrders(res.data.data);
        } catch (error) {
          console.error('Error fetching orders:', error);
        }
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  if (!user) return <div className="content">Please log in to view your profile.</div>;
  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="content">
      <h1>My Profile</h1>
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2>User Information</h2>
        <div style={{ marginTop: '1rem' }}>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> <span style={{ textTransform: 'capitalize' }}>{user.role}</span></p>
          <p><strong>Preferred Currency:</strong> {user.currency || 'USD'}</p>
        </div>
      </div>

      <div className="card">
        <h2>Recent Orders</h2>
        <div style={{ marginTop: '1rem' }}>
          {orders.length > 0 ? (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {orders.map((order) => (
                <li key={order._id} style={{ padding: '1rem 0', borderBottom: '1px solid #eee' }}>
                  <strong>Order ID:</strong> #{order._id.slice(-6)} | 
                  <strong> Status:</strong> {order.status} | 
                  <strong> Total:</strong> ${order.total}
                </li>
              ))}
            </ul>
          ) : (
            <p>You haven't placed any orders yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
