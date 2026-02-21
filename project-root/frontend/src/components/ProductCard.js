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
    <div className="card" style={{ width: '250px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <img 
        src={product.images && product.images[0] ? product.images[0] : '/placeholder.jpg'} 
        alt={product.name} 
        style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px' }} 
      />
      <div style={{ padding: '10px 0' }}>
        <h3 style={{ fontSize: '1.1rem', margin: '0.5rem 0' }}>{product.name}</h3>
        <p style={{ fontWeight: 'bold', color: '#007bff' }}>{formatCurrency(product.price)}</p>
        <p style={{ fontSize: '0.9rem', color: '#666' }}>
          {product.description?.substring(0, 60)}...
        </p>
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
        <Link to={`/products/${product._id}`} className="btn" style={{ flex: 1, textAlign: 'center', textDecoration: 'none' }}>
          Details
        </Link>
        <button onClick={handleAddToCart} className="btn" style={{ flex: 1, backgroundColor: '#28a745', color: 'white', border: 'none', cursor: 'pointer' }}>
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
