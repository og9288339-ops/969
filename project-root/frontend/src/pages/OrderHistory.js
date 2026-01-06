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
    <div>
      <h1>Order History</h1>
      {orders.length > 0 ? (
        <div>
          <div className="card">
            <h2>Your Orders</h2>
            {orders.map((order) => (
              <div key={order._id} style={{ borderBottom: '1px solid #ddd', padding: '1rem 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p><strong>Order ID:</strong> {order._id}</p>
                    <p><strong>Total:</strong> {formatCurrency(order.total)}</p>
                    <p><strong>Status:</strong> {order.status}</p>
                    <p><strong>Date:</strong> {formatDate(order.createdAt)}</p>
                  </div>
                  <button onClick={() => setSelectedOrder(order._id)} className="btn">Track Order</button>
                </div>
              </div>
            ))}
          </div>
          {selectedOrder && <OrderTracking orderId={selectedOrder} />}
        </div>
      ) : (
        <p>You haven't placed any orders yet.</p>
      )}
    </div>
  );
};

export default OrderHistory;