import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { formatCurrency, formatDate } from '../utils/helpers';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/admin/orders');
      setOrders(res.data.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
    setLoading(false);
  };

  const updateOrderStatus = async (id, status) => {
    try {
      await api.put(`/admin/orders/${id}`, { status });
      fetchOrders(); // تحديث القائمة بعد التعديل
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="content">
      <h2>Order Management</h2>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f4f4f4' }}>
              <th style={{ border: '1px solid #ddd', padding: '12px' }}>Order ID</th>
              <th style={{ border: '1px solid #ddd', padding: '12px' }}>User</th>
              <th style={{ border: '1px solid #ddd', padding: '12px' }}>Total</th>
              <th style={{ border: '1px solid #ddd', padding: '12px' }}>Status</th>
              <th style={{ border: '1px solid #ddd', padding: '12px' }}>Date</th>
              <th style={{ border: '1px solid #ddd', padding: '12px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} style={{ textAlign: 'center' }}>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{order._id}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{order.user?.name || 'Unknown'}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{formatCurrency(order.total)}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  <span className={`status-${order.status}`}>{order.status}</span>
                </td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{formatDate(order.createdAt)}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                    style={{ padding: '5px', borderRadius: '4px' }}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderManagement;
