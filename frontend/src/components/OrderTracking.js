import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { formatDate } from '../utils/helpers';

const OrderTracking = ({ orderId }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/${orderId}`);
        setOrder(res.data.data);
      } catch (error) {
        console.error('Error fetching order:', error);
      }
      setLoading(false);
    };
    fetchOrder();
  }, [orderId]);

  if (loading) return <div className="loading">Loading...</div>;
  if (!order) return <div className="error">Order not found.</div>;

  const statusSteps = ['pending', 'processing', 'shipped', 'delivered'];
  const currentStep = statusSteps.indexOf(order.status);

  return (
    <div className="card">
      <h2>Order Tracking</h2>
      <p>Order ID: {order._id}</p>
      <p>Status: {order.status}</p>
      <p>Ordered on: {formatDate(order.createdAt)}</p>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
        {statusSteps.map((step, index) => (
          <div key={step} style={{ textAlign: 'center', flex: 1 }}>
            <div style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              background: index <= currentStep ? '#007bff' : '#ddd',
              margin: '0 auto 0.5rem'
            }}></div>
            <p style={{ fontSize: '0.8rem' }}>{step.charAt(0).toUpperCase() + step.slice(1)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderTracking;