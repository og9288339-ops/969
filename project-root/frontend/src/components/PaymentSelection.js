import React from 'react';

const PaymentSelection = ({ paymentMethod, setPaymentMethod }) => {
  return (
    <div className="form-group">
      <label>Payment Method</label>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <label>
          <input
            type="radio"
            value="stripe"
            checked={paymentMethod === 'stripe'}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          Stripe
        </label>
        <label>
          <input
            type="radio"
            value="paypal"
            checked={paymentMethod === 'paypal'}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          PayPal
        </label>
        <label>
          <input
            type="radio"
            value="coinbase"
            checked={paymentMethod === 'coinbase'}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          Coinbase
        </label>
      </div>
    </div>
  );
};

export default PaymentSelection;