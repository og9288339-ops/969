import React from 'react';
import { Link } from 'react-router-dom';
import Cart from '../components/Cart';

const CartPage = () => {
  return (
    <div className="content">
      <h1 style={{ marginBottom: '1.5rem' }}>Shopping Cart</h1>
      <Cart />
      <div style={{ textAlign: 'center', marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
        <Link to="/products" className="btn" style={{ backgroundColor: '#6c757d', color: 'white', textDecoration: 'none' }}>
          Continue Shopping
        </Link>
        <Link to="/checkout" className="btn" style={{ backgroundColor: '#28a745', color: 'white', textDecoration: 'none' }}>
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
};

export default CartPage;
