import React from 'react';

const PaymentSelection = ({ paymentMethod, setPaymentMethod }) => {
  return (
    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
      <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>Payment Method</label>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        <label style={radioStyle(paymentMethod === 'stripe')}>
          <input
            type="radio"
            value="stripe"
            checked={paymentMethod === 'stripe'}
            onChange={(e) => setPaymentMethod(e.target.value)}
            style={{ marginRight: '8px' }}
          />
          Stripe (Credit Card)
        </label>
        
        <label style={radioStyle(paymentMethod === 'paypal')}>
          <input
            type="radio"
            value="paypal"
            checked={paymentMethod === 'paypal'}
            onChange={(e) => setPaymentMethod(e.target.value)}
            style={{ marginRight: '8px' }}
          />
          PayPal
        </label>
        
        <label style={radioStyle(paymentMethod === 'coinbase')}>
          <input
            type="radio"
            value="coinbase"
            checked={paymentMethod === 'coinbase'}
            onChange={(e) => setPaymentMethod(e.target.value)}
            style={{ marginRight: '8px' }}
          />
          Coinbase (Crypto)
        </label>
      </div>
    </div>
  );
};

// تنسيق بسيط عشان الاختيارات تبان كأنها أزرار احترافية
const radioStyle = (isSelected) => ({
  border: isSelected ? '2px solid #007bff' : '1px solid #ddd',
  padding: '10px 15px',
  borderRadius: '8px',
  cursor: 'pointer',
  backgroundColor: isSelected ? '#f0f7ff' : '#fff',
  transition: 'all 0.2s ease',
  display: 'flex',
  alignItems: 'center'
});

export default PaymentSelection;
