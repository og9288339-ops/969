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
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  if (loading) return <div className="loading">Loading...</div>;
  if (!order) return <div className="error">Order not found.</div>;

  const statusSteps = ['pending', 'processing', 'shipped', 'delivered'];
  const currentStep = statusSteps.indexOf(order.status);

  return (
    <div className="card">
      <h2>Order Tracking</h2>
      <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
        <p><strong>Order ID:</strong> {order._id}</p>
        <p><strong>Status:</strong> <span className={`status-badge ${order.status}`}>{order.status}</span></p>
        <p><strong>Ordered on:</strong> {formatDate(order.createdAt)}</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', position: 'relative' }}>
        {statusSteps.map((step, index) => (
          <div key={step} style={{ textAlign: 'center', flex: 1, zIndex: 1 }}>
            <div style={{
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              background: index <= currentStep ? '#007bff' : '#ddd',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 0.5rem',
              fontWeight: 'bold',
              transition: 'background 0.3s ease'
            }}>
              {index + 1}
            </div>
            <p style={{ 
              fontSize: '0.8rem', 
              fontWeight: index === currentStep ? 'bold' : 'normal',
              color: index <= currentStep ? '#007bff' : '#666'
            }}>
              {step.charAt(0).toUpperCase() + step.slice(1)}
            </p>
          </div>
        ))}
        {/* خط الواصل بين الخطوات */}
        <div style={{
          position: 'absolute',
          top: '15px',
          left: '12%',
          right: '12%',
          height: '2px',
          background: '#ddd',
          zIndex: 0
        }}>
          <div style={{
            width: `${(currentStep / (statusSteps.length - 1)) * 100}%`,
            height: '100%',
            background: '#007bff',
            transition: 'width 0.5s ease'
          }}></div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
