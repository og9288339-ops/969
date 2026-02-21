import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import OrderTracking from '../components/OrderTracking';
import { formatCurrency, formatDate } from '../utils/helpers';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

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

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="content">
      <h1 style={{ marginBottom: '2rem' }}>Order History</h1>
      {orders.length > 0 ? (
        <div>
          <div className="card">
            <h2 style={{ marginBottom: '1.5rem' }}>Your Orders</h2>
            {orders.map((order) => (
              <div key={order._id} style={{ borderBottom: '1px solid #eee', padding: '1.5rem 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <p><strong>Order ID:</strong> <span style={{ color: '#666' }}>{order._id}</span></p>
                    <p><strong>Total:</strong> <span style={{ color: '#28a745', fontWeight: 'bold' }}>{formatCurrency(order.total)}</span></p>
                    <p>
                      <strong>Status:</strong> 
                      <span className={`status-${order.status.toLowerCase()}`} style={{ marginLeft: '0.5rem', padding: '0.2rem 0.6rem', borderRadius: '4px', backgroundColor: '#e9ecef', fontSize: '0.9rem' }}>
                        {order.status}
                      </span>
                    </p>
                    <p><strong>Date:</strong> {formatDate(order.createdAt)}</p>
                  </div>
                  <button onClick={() => setSelectedOrder(order._id)} className="btn">
                    Track Order
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {selectedOrder && (
            <div style={{ marginTop: '2rem' }}>
              <OrderTracking orderId={selectedOrder} />
            </div>
          )}
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ fontSize: '1.2rem', color: '#666' }}>You haven't placed any orders yet.</p>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
