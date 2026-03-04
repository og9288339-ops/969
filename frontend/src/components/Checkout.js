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
    // Implement order creation logic
    console.log('Order submitted', { cart, shippingAddress, paymentMethod });
    clearCart();
  };

  if (!user) {
    return <p>Please log in to checkout.</p>;
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
        <PaymentSelection paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} />
        <div style={{ marginTop: '1rem' }}>
          <h3>Total: {formatCurrency(getTotal())}</h3>
          <button type="submit" className="btn" style={{ width: '100%' }}>Place Order</button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;