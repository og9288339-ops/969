import React from 'react';
import Checkout from '../components/Checkout';

const CheckoutPage = () => {
  return (
    <div className="content">
      <h1 style={{ marginBottom: '2rem', textAlign: 'center' }}>Checkout</h1>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Checkout />
      </div>
    </div>
  );
};

export default CheckoutPage;
