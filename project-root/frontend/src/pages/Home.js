import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import AIRecommendations from '../components/AIRecommendations';
import { useAuth } from '../hooks/useAuth';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const res = await api.get('/products?page=1&limit=8');
        setFeaturedProducts(res.data.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
      setLoading(false);
    };
    fetchFeaturedProducts();
  }, []);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="content">
      <section style={{ 
        textAlign: 'center', 
        padding: '3rem 1rem', 
        background: 'linear-gradient(135deg, #6e8efb, #a777e3)', 
        color: 'white',
        borderRadius: '12px',
        marginBottom: '2rem' 
      }}>
        <h1>Welcome to AI-Commerce</h1>
        <p>Discover amazing products with AI-powered recommendations</p>
      </section>

      <section>
        <h2 style={{ marginBottom: '1.5rem' }}>Featured Products</h2>
        <div className="grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
          gap: '1.5rem' 
        }}>
          {featuredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      {user && (
        <section style={{ marginTop: '3rem', padding: '2rem', backgroundColor: '#f8f9fa', borderRadius: '12px' }}>
          <h2 style={{ marginBottom: '1rem' }}>Selected For You ✨</h2>
          <AIRecommendations userHistory={[]} />
        </section>
      )}
    </div>
  );
};

export default Home;
