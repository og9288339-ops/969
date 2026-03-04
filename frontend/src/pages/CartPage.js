import React from 'react';
import { Link } from 'react-router-dom';
import Cart from '../components/Cart';

const CartPage = () => {
  return (
    <div>
      <h1>Shopping Cart</h1>
      <Cart />
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <Link to="/products" className="btn">Continue Shopping</Link>
        <Link to="/checkout" className="btn" style={{ marginLeft: '1rem' }}>Proceed to Checkout</Link>
      </div>
    </div>
  );
};

export default CartPage;