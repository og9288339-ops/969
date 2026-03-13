import React, { useState, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Zap, 
  Star, 
  ShoppingCart, 
  Heart, 
  Loader2,
  Sparkles
} from 'lucide-react';
import './AIRecommendations.css';

const AIRecommendations = memo(() => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);

  // Fetch AI recommendations
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/ai/recommendations', {
          method: 'GET',
          credentials: 'include', // Include cookies for user session
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch AI recommendations');
        }

        const data = await response.json();
        setRecommendations(data.recommendations || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  // AI Reasoning messages (simulated)
  const aiReasonings = [
    "Based on your interest in luxury watches",
    "Matches your preference for minimalist design",
    "Perfect complement to your recent purchases",
    "Trending among similar style profiles",
    "AI detected your love for premium materials",
    "Recommended based on your browsing patterns",
  ];

  // Skeleton Card Component
  const SkeletonCard = memo(() => (
    <motion.div
      className="ai-card skeleton"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="skeleton-image"></div>
      <div className="skeleton-content">
        <div className="skeleton-title"></div>
        <div className="skeleton-badge"></div>
        <div className="skeleton-description"></div>
        <div className="skeleton-price"></div>
      </div>
    </motion.div>
  ));

  // AI Recommendation Card
  const AIRecommendationCard = memo(({ product, index }) => {
    const reasoning = aiReasonings[index % aiReasonings.length];

    return (
      <motion.div
        className="ai-card"
        initial={{ opacity: 0, y: 30, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        whileHover={{ scale: 1.05, y: -10 }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
        onHoverStart={() => setHoveredCard(product.id)}
        onHoverEnd={() => setHoveredCard(null)}
      >
        {/* Product Image */}
        <div className="ai-image-container">
          <img
            src={product.image || 'https://via.placeholder.com/400x300/1a1a1a/ffffff?text=AI+Recommended'}
            alt={product.name}
            className="ai-image"
            loading="lazy"
          />
          <div className="ai-badge">
            <Zap size={14} />
            <span>AI-Matched</span>
          </div>
        </div>

        {/* Product Info */}
        <div className="ai-card-content">
          <h3 className="ai-product-title">{product.name || 'Premium Product'}</h3>
          <div className="ai-rating">
            <Star fill="#fbbf24" size={16} />
            <span>{product.rating || 4.8}</span>
          </div>
          <p className="ai-description">
            {product.description || 'AI-curated luxury item perfectly matched to your style.'}
          </p>
          <div className="ai-price-section">
            <span className="ai-price">${product.price?.toFixed(2) || '999'}</span>
            <div className="ai-actions">
              <button className="ai-cart-btn">
                <ShoppingCart size={16} />
              </button>
              <button className="ai-wishlist-btn">
                <Heart size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* AI Reasoning Tooltip */}
        {hoveredCard === product.id && (
          <motion.div
            className="ai-tooltip"
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
          >
            <div className="tooltip-content">
              <Sparkles size={16} className="tooltip-icon" />
              <div>
                <h4>Why this for you?</h4>
                <p>{reasoning}</p>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    );
  });

  AIRecommendationCard.displayName = 'AIRecommendationCard';

  return (
    <section className="ai-recommendations">
      {/* Header */}
      <motion.div 
        className="ai-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="ai-title-container">
          <motion.div 
            className="ai-icon-glow"
            animate={{ 
              scale: [1, 1.05, 1],
              boxShadow: [
                "0 0 20px rgba(79, 70, 229, 0.5)",
                "0 0 30px rgba(79, 70, 229, 0.8)",
                "0 0 20px rgba(79, 70, 229, 0.5)"
              ]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut" 
            }}
          >
            <Brain size={32} />
          </motion.div>
          <div>
            <h2 className="ai-title">Smart Suggestions</h2>
            <p className="ai-subtitle">
              AI-powered recommendations based on your unique style
            </p>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="ai-content">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loading"
              className="ai-loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="loading-header">
                <Loader2 className="loading-spinner" size={24} />
                <span>Analyzing your preferences...</span>
              </div>
              <div className="ai-grid">
                {Array.from({ length: 4 }).map((_, index) => (
                  <SkeletonCard key={`skeleton-${index}`} />
                ))}
              </div>
            </motion.div>
          ) : error ? (
            <motion.div 
              key="error"
              className="ai-error"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="error-content">
                <Brain size={48} className="error-icon" />
                <h3>AI temporarily unavailable</h3>
                <p>Unable to fetch personalized recommendations at this time.</p>
                <button 
                  className="retry-btn"
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </button>
              </div>
            </motion.div>
          ) : recommendations.length === 0 ? (
            <motion.div 
              key="empty"
              className="ai-empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="empty-content">
                <Sparkles size={64} className="empty-icon" />
                <h3>Discovering your style...</h3>
                <p>Our AI is learning your preferences. Browse more products to unlock personalized recommendations.</p>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="recommendations"
              className="ai-grid-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="ai-grid">
                {recommendations.map((product, index) => (
                  <AIRecommendationCard key={product.id} product={product} index={index} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
});

AIRecommendations.displayName = 'AIRecommendations';

export default AIRecommendations;
