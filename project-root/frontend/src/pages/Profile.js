import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../utils/api';

const Profile = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders');
        setOrders(res.data.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
      setLoading(false);
    };
    fetchOrders();
  }, []);

  if (!user) return <div>Please log in to view your profile.</div>;
  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <h1>Profile</h1>
      <div className="card">
        <h2>User Information</h2>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
        <p><strong>Currency:</strong> {user.currency}</p>
      </div>
      <div className="card" style={{ marginTop: '2rem' }}>
        <h2>Order History</h2>
        {orders.length > 0 ? (
          <ul>
            {orders.map((order) => (
              <li key={order._id}>
                Order #{order._id} - {order.status} - ${order.total}
              </li>
            ))}
          </ul>
        ) : (
          <p>No orders yet.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;