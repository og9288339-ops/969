import React from 'react';
import ProductCard from './ProductCard';
import AIRecommendations from './AIRecommendations';

const Home = () => {
  // Mock data for the product grid
  const featuredProducts = [
    { id: 1, name: "AI Smart Watch", price: 299.99, image: "https://via.placeholder.com/300" },
    { id: 2, name: "Neural Headphones", price: 149.50, image: "https://via.placeholder.com/300" },
    { id: 3, name: "Robotic Vacuum", price: 450.00, image: "https://via.placeholder.com/300" },
    { id: 4, name: "Smart Home Hub", price: 89.99, image: "https://via.placeholder.com/300" },
  ];

  return (
    <main className="home-container">
      
      {/* 1. Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>The Future of Shopping is Here</h1>
          <p>Experience personalized AI-driven shopping. Discover products tailored specifically to your style and needs.</p>
          <button className="cta-button primary">Start Shopping</button>
        </div>
      </section>

      {/* 2. Features Section */}
      <section className="features-section">
        <div className="container">
          <h2>Why Choose Us?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="icon">🧠</div>
              <h3>AI Product Recommendations</h3>
              <p>Our algorithms learn your preferences to show you exactly what you want.</p>
            </div>
            <div className="feature-card">
              <div className="icon">📊</div>
              <h3>Smart Analytics</h3>
              <p>Real-time insights into market trends and inventory management.</p>
            </div>
            <div className="feature-card">
              <div className="icon">🔒</div>
              <h3>Secure Payments</h3>
              <p>Bank-grade encryption ensures your transactions are always safe.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Products Preview */}
      <section className="products-section">
        <div className="container">
          <h2>Featured Products</h2>
          <div className="product-grid">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. AI Recommendation Section */}
      <section className="ai-section">
        <div className="container">
          <h2>Personalized for You</h2>
          <p>Based on your recent browsing history, we think you'll love these.</p>
          <AIRecommendations />
        </div>
      </section>

      {/* 5. Call To Action Section */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to upgrade your store?</h2>
          <p>Join thousands of merchants using our AI platform today.</p>
          <button className="cta-button secondary">Register Now</button>
        </div>
      </section>

    </main>
  );
};

export default Home;
