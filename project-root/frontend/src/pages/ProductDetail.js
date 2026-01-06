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
    <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div>
          <img src={product.images[0] || '/placeholder.jpg'} alt={product.name} style={{ width: '100%' }} />
        </div>
        <div>
          <h1>{product.name}</h1>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#007bff' }}>{formatCurrency(product.price)}</p>
          <p>Category: {product.category.name}</p>
          <p>Stock: {product.stock}</p>
          <p>{product.description}</p>
          <button onClick={handleAddToCart} className="btn" style={{ width: '100%' }}>Add to Cart</button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;