import React from 'react';
import { useCart } from '../hooks/useCart';
import { formatCurrency } from '../utils/helpers';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getTotal } = useCart();

  if (cart.length === 0) {
    return <p>Your cart is empty.</p>;
  }

  return (
    <div className="card">
      <h2>Shopping Cart</h2>
      {cart.map((item) => (
        <div key={item.product._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h4>{item.product.name}</h4>
            <p>{formatCurrency(item.product.price)}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button onClick={() => updateQuantity(item.product._id, item.quantity - 1)}>-</button>
            <span>{item.quantity}</span>
            <button onClick={() => updateQuantity(item.product._id, item.quantity + 1)}>+</button>
            <button onClick={() => removeFromCart(item.product._id)} className="btn-danger">Remove</button>
          </div>
        </div>
      ))}
      <div style={{ borderTop: '1px solid #ddd', paddingTop: '1rem', textAlign: 'right' }}>
        <h3>Total: {formatCurrency(getTotal())}</h3>
      </div>
    </div>
  );
};

export default Cart;