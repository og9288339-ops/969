import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';
import { useCart } from '../hooks/useCart';
import { formatCurrency } from '../utils/helpers';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data.data);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!product) return <div className="error">Product not found.</div>;

  return (
    <div className="card" style={{ maxWidth: '900px', margin: '2rem auto', padding: '2rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        <div style={{ borderRadius: '8px', overflow: 'hidden' }}>
          <img 
            src={product.images?.[0] || '/placeholder.jpg'} 
            alt={product.name} 
            style={{ width: '100%', height: 'auto', display: 'block' }} 
          />
        </div>
        <div>
          <h1 style={{ marginBottom: '1rem' }}>{product.name}</h1>
          <p style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#28a745', marginBottom: '1rem' }}>
            {formatCurrency(product.price)}
          </p>
          <div style={{ marginBottom: '1.5rem' }}>
            <p><strong>Category:</strong> {product.category?.name}</p>
            <p><strong>Availability:</strong> {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</p>
          </div>
          <hr style={{ border: '0', borderTop: '1px solid #eee', margin: '1rem 0' }} />
          <p style={{ lineHeight: '1.6', color: '#555', marginBottom: '2rem' }}>
            {product.description}
          </p>
          <button 
            onClick={handleAddToCart} 
            className="btn" 
            disabled={product.stock <= 0}
            style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
          >
            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
