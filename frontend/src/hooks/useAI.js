/**
 * @module useAI
 * @description Premium React Hook for luxury e-commerce AI integration
 * @author Senior Frontend Architect
 * @version 1.2.0
 * @since 2024
 */

import { useState, useCallback, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAI as useAIContext } from './AIContext'; // Import your AIContext

/**
 * @typedef {Object} AIBadgeProps
 * @property {string} text - Badge text (e.g., '98% Match')
 * @property {string} variant - Badge variant ('elite', 'match', 'choice')
 */

/**
 * @typedef {Object} UseAIReturn
 * @property {Array} recommendations - AI recommendations
 * @property {boolean} isGenerating - Loading state
 * @property {Array} insights - AI insights
 * @property {Function} getSmartSuggestions - Category-aware suggestions
 * @property {Function} trackView - Track product views
 * @property {Function} generateAIBadge - Create styled badges
 * @property {Object} motionVariants - Framer Motion presets
 */

/**
 * Default fallback recommendations for offline/smart recovery
 */
const FALLBACK_RECOMMENDATIONS = [
  {
    id: 'fallback-1',
    name: 'Elite Chronograph',
    score: 95,
    category: 'Watches',
    reason: 'Timeless luxury choice'
  },
  {
    id: 'fallback-2',
    name: 'Signature Tote',
    score: 92,
    category: 'Handbags',
    reason: 'Perfect everyday elegance'
  }
];

/**
 * Session storage key for user preferences
 */
const SESSION_PREFERENCES = 'ai_user_views';

/**
 * Premium useAI Hook - Cinematic AI Integration
 * @returns {UseAIReturn} Complete AI interface
 */
export const useAI = () => {
  const {
    aiRecommendations,
    isGenerating,
    aiInsights,
    trackUserBehavior,
    addAIInsight
  } = useAIContext();

  const [smartLoading, setSmartLoading] = useState(false);
  const [sessionViews, setSessionViews] = useState(new Set());

  // Load session views on mount
  useEffect(() => {
    try {
      const savedViews = sessionStorage.getItem(SESSION_PREFERENCES);
      if (savedViews) {
        setSessionViews(new Set(JSON.parse(savedViews)));
      }
    } catch (error) {
      console.warn('Failed to load session views:', error);
    }
  }, []);

  // Save session views on change
  useEffect(() => {
    try {
      sessionStorage.setItem(
        SESSION_PREFERENCES,
        JSON.stringify(Array.from(sessionViews))
      );
    } catch (error) {
      console.warn('Failed to save session views:', error);
    }
  }, [sessionViews]);

  /**
   * Get smart category-based suggestions with cinematic loading
   * @param {string} [category] - Optional category filter
   * @returns {Promise<Array>} Filtered recommendations
   */
  const getSmartSuggestions = useCallback(async (category = null) => {
    try {
      setSmartLoading(true);

      // Simulate AI processing delay for cinematic effect
      await new Promise(resolve => setTimeout(resolve, 800));

      let suggestions = aiRecommendations;

      if (category) {
        suggestions = suggestions.filter(item => 
          item.category?.toLowerCase() === category.toLowerCase()
        );
      }

      // Boost suggestions based on session views
      suggestions.sort((a, b) => {
        const aViewed = sessionViews.has(a.id);
        const bViewed = sessionViews.has(b.id);
        return bViewed - aViewed || b.score - a.score;
      });

      return suggestions.length > 0 ? suggestions : FALLBACK_RECOMMENDATIONS;
    } catch (error) {
      console.error('Smart suggestions failed:', error);
      return FALLBACK_RECOMMENDATIONS;
    } finally {
      setSmartLoading(false);
    }
  }, [aiRecommendations, sessionViews]);

  /**
   * Track product view for real-time personalization
   * @param {string} productId - Product ID to track
   * @param {Object} [meta] - Additional metadata
   */
  const trackView = useCallback((productId, meta = {}) => {
    if (!productId) return;

    // Update session views
    setSessionViews(prev => {
      const newViews = new Set(prev);
      newViews.add(productId);
      return newViews;
    });

    // Track via AI context
    trackUserBehavior({
      type: 'view',
      productId,
      timestamp: Date.now(),
      ...meta
    });

    // Invalidate recommendations cache after 5 views
    if (sessionViews.size >= 5) {
      localStorage.removeItem('ai_recommendations');
    }
  }, [trackUserBehavior, sessionViews.size]);

  /**
   * Generate cinematic AI match badge
   * @param {number} score - Relevance score (0-100)
   * @param {Object} [options] - Badge customization
   * @returns {React.ReactNode} Styled badge component
   */
  const generateAIBadge = useCallback((score, options = {}) => {
    const { size = 'md', variant = 'elite' } = options;
    
    const getVariantClass = () => {
      if (score >= 95) return 'elite';
      if (score >= 85) return 'match';
      if (score >= 70) return 'good';
      return 'basic';
    };

    const getBadgeText = () => {
      if (score >= 95) return `${score}% Elite Match`;
      if (score >= 85) return `${score}% Perfect`;
      if (score >= 70) return `${score}% Great`;
      return 'Recommended';
    };

    return (
      <motion.span
        className={`ai-badge ai-badge--${getVariantClass()} ai-badge--${size}`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      >
        {getBadgeText()}
      </motion.span>
    );
  }, []);

  /**
   * Pre-configured Framer Motion variants for AI content
   */
  const motionVariants = useMemo(() => ({
    // Cinematic entry for recommendations
    recommendationItem: {
      hidden: { 
        opacity: 0, 
        y: 30, 
        scale: 0.95,
        filter: 'blur(8px)'
      },
      visible: (i) => ({
        opacity: 1,
        y: 0,
        scale: 1,
        filter: 'blur(0px)',
        transition: {
          duration: 0.6,
          delay: i * 0.1,
          ease: [0.22, 1, 0.36, 1]
        }
      })
    },

    // Pulsing loading state
    aiLoading: {
      initial: { scale: 1 },
      animate: {
        scale: [1, 1.05, 1],
        transition: {
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut'
        }
      }
    },

    // Success feedback
    aiSuccess: {
      scale: [1, 1.1, 1],
      rotate: [0, 5, -5, 0],
      transition: { duration: 0.6 }
    }
  }), []);

  // Fully memoized return value - PERFORMANCE CRITICAL
  return useMemo(() => ({
    recommendations: aiRecommendations,
    isGenerating: isGenerating || smartLoading,
    insights: aiInsights,
    getSmartSuggestions,
    trackView,
    generateAIBadge,
    motionVariants,
    sessionViewCount: sessionViews.size,
    hasViewedProducts: sessionViews.size > 0
  }), [
    aiRecommendations,
    isGenerating,
    smartLoading,
    aiInsights,
    getSmartSuggestions,
    trackView,
    generateAIBadge,
    motionVariants,
    sessionViews.size
  ]);
};

/**
 * Quick Usage Examples
 */

/**
 * Example 1: Product Recommendations List
 */
// function AIRecommendations() {
//   const { 
//     recommendations, 
//     isGenerating, 
//     motionVariants,
//     generateAIBadge 
//   } = useAI();
//
//   return (
//     <div className="ai-grid">
//       <AnimatePresence>
//         {recommendations.map((rec, index) => (
//           <motion.div
//             key={rec.id}
//             variants={motionVariants.recommendationItem}
//             initial="hidden"
//             animate="visible"
//             custom={index}
//           >
//             <img src={rec.image} alt={rec.name} />
//             <h3>{rec.name}</h3>
//             {generateAIBadge(rec.score)}
//           </motion.div>
//         ))}
//       </AnimatePresence>
//     </div>
//   );
// }

/**
 * Example 2: Product View Tracking
 */
// function ProductCard({ product }) {
//   const { trackView } = useAI();
//
//   const handleView = () => {
//     trackView(product.id, { category: product.category });
//   };
//
//   return (
//     <div onMouseEnter={handleView}>
//       {/* Product content */}
//     </div>
//   );
// }

/**
 * Example 3: Category Suggestions
 */
// function CategorySuggestions({ category }) {
//   const { getSmartSuggestions } = useAI();
//
//   const [suggestions, setSuggestions] = useState([]);
//
//   const loadSuggestions = async () => {
//     const results = await getSmartSuggestions(category);
//     setSuggestions(results);
//   };
//
//   return (
//     <button onClick={loadSuggestions}>
//       Smart Suggestions for {category}
//     </button>
//   );
// }

export default useAI;
