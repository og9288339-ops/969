import React, { useState } from 'react';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import PaymentSelection from './PaymentSelection';
import { formatCurrency } from '../utils/helpers';

const Checkout = () => {
  const { cart, getTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    country: '',
    postalCode: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    // هنا بيتم الربط مع الـ Backend (orders route)
    console.log('Order submitted', { cart, shippingAddress, paymentMethod });
    // بعد نجاح الطلب بنمسح السلة
    clearCart();
    alert('Order placed successfully! 🚀');
  };

  if (!user) {
    return <p style={{ textAlign: 'center', padding: '2rem' }}>Please log in to checkout.</p>;
  }

  if (cart.length === 0) {
    return <p style={{ textAlign: 'center', padding: '2rem' }}>Your cart is empty.</p>;
  }

  return (
    <div className="card">
      <h2>Checkout</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Shipping Address</label>
          <input
            type="text"
            placeholder="Address"
            value={shippingAddress.address}
            onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="City"
            value={shippingAddress.city}
            onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Country"
            value={shippingAddress.country}
            onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Postal Code"
            value={shippingAddress.postalCode}
            onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
            required
          />
        </div>
        
        <PaymentSelection 
          paymentMethod={paymentMethod} 
          setPaymentMethod={setPaymentMethod} 
        />

        <div style={{ marginTop: '1rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
          <h3 style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Total Amount:</span>
            <span>{formatCurrency(getTotal())}</span>
          </h3>
          <button type="submit" className="btn" style={{ width: '100%', marginTop: '1rem' }}>
            Place Order
          </button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
