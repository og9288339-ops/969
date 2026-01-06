import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { formatCurrency } from '../utils/helpers';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <div className="card" style={{ width: '250px' }}>
      <img src={product.images[0] || '/placeholder.jpg'} alt={product.name} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
      <h3>{product.name}</h3>
      <p>{formatCurrency(product.price)}</p>
      <p>{product.description.substring(0, 100)}...</p>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <Link to={`/products/${product._id}`} className="btn">View Details</Link>
        <button onClick={handleAddToCart} className="btn">Add to Cart</button>
      </div>
    </div>
  );
};

export default ProductCard;