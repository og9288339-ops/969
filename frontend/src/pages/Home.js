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
        if (res.data && res.data.data) {
          setFeaturedProducts(res.data.data);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedProducts();
  }, []);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <section style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1>Welcome to AI-Commerce</h1>
        <p>Discover amazing products with AI-powered recommendations</p>
      </section>

      <section>
        <h2>Featured Products</h2>
        <div className="grid">
          {featuredProducts && featuredProducts.length > 0 ? (
            featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <p style={{ textAlign: 'center', gridColumn: '1/-1' }}>No products found.</p>
          )}
        </div>
      </section>

      {user && (
        <section style={{ marginTop: '2rem' }}>
          <AIRecommendations userHistory={[]} />
        </section>
      )}
    </div>
  );
};

export default Home;
