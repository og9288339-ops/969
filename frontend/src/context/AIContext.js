/**
 * @module AIContext
 * @description Enterprise-level React Context for managing AI-powered features
 * @author Senior Architect
 * @version 1.0.0
 * @since 2024
 */

import React, { 
  createContext, 
  useContext, 
  useState, 
  useCallback, 
  useMemo, 
  useEffect 
} from 'react';

/**
 * @typedef {Object} AIRecommendation
 * @property {string} id - Unique product ID
 * @property {string} name - Product name
 * @property {number} price - Product price
 * @property {string} image - Product image URL
 * @property {string} category - Product category
 * @property {string} reason - AI recommendation reason
 */

/**
 * @typedef {Object} UserPreference
 * @property {string[]} favoriteCategories - User's preferred categories
 * @property {string[]} styleProfile - Inferred style preferences
 * @property {number} avgOrderValue - Average order value
 */

/**
 * @typedef {Object} AIInsight
 * @property {string} title - Insight title
 * @property {string} description - Insight description
 * @property {string} type - Insight type (tip, alert, suggestion)
 */

/**
 * @typedef {Object} AIContextType
 * @property {AIRecommendation[]} aiRecommendations - AI product recommendations
 * @property {boolean} isGenerating - AI processing state
 * @property {UserPreference} userPreferences - User behavior profile
 * @property {AIInsight[]} aiInsights - Smart shopping insights
 * @property {Function} fetchAIRecommendations - Fetch personalized recommendations
 * @property {Function} trackUserBehavior - Track user actions for AI learning
 * @property {Function} getSmartDiscount - Get AI-calculated discount
 * @property {Function} clearCache - Clear AI cache
 */

/**
 * Default mock data for offline development and error states
 */
const MOCK_RECOMMENDATIONS = [
  {
    id: 'mock-1',
    name: 'Luxe Chronograph Watch',
    price: 1299.99,
    image: 'https://via.placeholder.com/300x300/1a1a1a/ffffff?text=Watch',
    category: 'Watches',
    reason: 'Perfect match for your minimalist style'
  },
  {
    id: 'mock-2',
    name: 'Designer Leather Tote',
    price: 899.50,
    image: 'https://via.placeholder.com/300x300/1a1a1a/ffffff?text=Bag',
    category: 'Handbags',
    reason: 'Based on your recent luxury accessory views'
  },
  {
    id: 'mock-3',
    name: '18K Gold Eternity Ring',
    price: 2499.00,
    image: 'https://via.placeholder.com/300x300/1a1a1a/ffffff?text=Ring',
    category: 'Jewelry',
    reason: 'Trending among similar style profiles'
  }
];

const MOCK_PREFERENCES = {
  favoriteCategories: ['Watches', 'Handbags', 'Jewelry'],
  styleProfile: ['Minimalist', 'Luxury', 'Modern'],
  avgOrderValue: 1482.83
};

const MOCK_INSIGHTS = [
  {
    title: 'Upgrade Your Collection',
    description: 'Consider adding a statement piece to complement your minimalist style',
    type: 'suggestion'
  },
  {
    title: 'VIP Early Access',
    description: 'New collection drops in 3 days - you\'ll be first to shop',
    type: 'alert'
  },
  {
    title: 'Smart Bundle',
    description: 'Save 15% when bundling watch + wallet from same collection',
    type: 'tip'
  }
];

/**
 * Cache utilities for AI data persistence
 */
const CACHE = {
  RECOMMENDATIONS: 'ai_recommendations',
  RECOMMENDATIONS_TIMESTAMP: 'ai_recommendations_ts',
  CACHE_TTL: 15 * 60 * 1000, // 15 minutes
};

/**
 * Check if cached data is still valid
 * @param {string} cacheKey - Cache key to check
 * @returns {boolean} - True if cache is valid
 */
const isCacheValid = (cacheKey) => {
  const timestamp = localStorage.getItem(`${cacheKey}_ts`);
  if (!timestamp) return false;
  
  const age = Date.now() - parseInt(timestamp);
  return age < CACHE.CACHE_TTL;
};

/**
 * Get cached data or null
 * @param {string} cacheKey - Cache key
 * @returns {any|null} - Cached data or null
 */
const getCachedData = (cacheKey) => {
  if (isCacheValid(cacheKey)) {
    return JSON.parse(localStorage.getItem(cacheKey) || 'null');
  }
  return null;
};

/**
 * Set cached data with timestamp
 * @param {string} cacheKey - Cache key
 * @param {any} data - Data to cache
 */
const setCachedData = (cacheKey, data) => {
  localStorage.setItem(cacheKey, JSON.stringify(data));
  localStorage.setItem(`${cacheKey}_ts`, Date.now().toString());
};

/**
 * AI Context Provider - Enterprise Level State Management
 * @param {Object} props - React props
 * @param {React.ReactNode} props.children - Child components
 */
export const AIProvider = ({ children }) => {
  // Core AI states with useMemo optimization
  const [aiRecommendations, setAIRecommendations] = useState(MOCK_RECOMMENDATIONS);
  const [isGenerating, setIsGenerating] = useState(false);
  const [userPreferences, setUserPreferences] = useState(MOCK_PREFERENCES);
  const [aiInsights, setAIInsights] = useState(MOCK_INSIGHTS);

  // Development logging utility
  const log = useCallback((message, data = null) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`🤖 AI [${new Date().toISOString()}] ${message}`, data || '');
    }
  }, []);

  /**
   * Fetch personalized AI recommendations from backend
   * @param {string} [userId] - Optional user ID for personalization
   * @returns {Promise<void>}
   */
  const fetchAIRecommendations = useCallback(async (userId = null) => {
    try {
      log('Fetching AI recommendations...', { userId });

      // Check cache first
      const cached = getCachedData(CACHE.RECOMMENDATIONS);
      if (cached) {
        log('Using cached recommendations');
        setAIRecommendations(cached);
        return;
      }

      setIsGenerating(true);

      const url = userId 
        ? `/api/ai/recommendations?userId=${userId}`
        : '/api/ai/recommendations';

      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Cache the response
      setCachedData(CACHE.RECOMMENDATIONS, data.recommendations);
      setAIRecommendations(data.recommendations || MOCK_RECOMMENDATIONS);
      
      log('AI recommendations loaded successfully', data.recommendations);
    } catch (error) {
      log('AI recommendations fetch failed, using mock data', error);
      setAIRecommendations(MOCK_RECOMMENDATIONS);
    } finally {
      setIsGenerating(false);
    }
  }, [log]);

  /**
   * Track user behavior for real-time AI learning
   * @param {Object} action - User action details
   * @param {string} action.type - Action type (view, click, purchase, etc.)
   * @param {string} action.productId - Product ID (if applicable)
   * @param {string} [action.category] - Product category
   * @returns {Promise<void>}
   */
  const trackUserBehavior = useCallback(async (action) => {
    try {
      log('Tracking user behavior', action);

      // Invalidate cache on significant actions
      if (['purchase', 'add_to_cart'].includes(action.type)) {
        localStorage.removeItem(CACHE.RECOMMENDATIONS);
        localStorage.removeItem(`${CACHE.RECOMMENDATIONS}_ts`);
      }

      const response = await fetch('/api/ai/track', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...action,
          timestamp: Date.now(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to track behavior');
      }

      log('User behavior tracked successfully');
    } catch (error) {
      log('Behavior tracking failed (non-critical)', error);
      // Don't fail the app if tracking fails
    }
  }, [log]);

  /**
   * Get AI-calculated smart discount for current user
   * @returns {Promise<{amount: number, code: string, expires: string}>}
   */
  const getSmartDiscount = useCallback(async () => {
    try {
      log('Calculating smart discount...');

      setIsGenerating(true);

      const response = await fetch('/api/ai/discount', {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to calculate discount');
      }

      const discount = await response.json();
      log('Smart discount calculated', discount);
      return discount;
    } catch (error) {
      log('Smart discount failed, returning mock', error);
      // Mock discount fallback
      return {
        amount: 15, // 15% off
        code: 'AI15OFF',
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      };
    } finally {
      setIsGenerating(false);
    }
  }, [log]);

  /**
   * Clear AI cache and reset to initial state
   */
  const clearCache = useCallback(() => {
    log('Clearing AI cache');
    localStorage.removeItem(CACHE.RECOMMENDATIONS);
    localStorage.removeItem(`${CACHE.RECOMMENDATIONS}_ts`);
    setAIRecommendations(MOCK_RECOMMENDATIONS);
  }, [log]);

  /**
   * Update user preferences manually (admin/debug use)
   * @param {UserPreference} preferences - New preferences
   */
  const updateUserPreferences = useCallback((preferences) => {
    log('Updating user preferences', preferences);
    setUserPreferences(preferences);
  }, [log]);

  /**
   * Add AI insight (for dynamic notifications)
   * @param {AIInsight} insight - New insight to add
   */
  const addAIInsight = useCallback((insight) => {
    log('Adding AI insight', insight);
    setAIInsights(prev => [insight, ...prev.slice(0, 4)]); // Keep top 5
  }, [log]);

  // Fully memoized context value - CRITICAL for performance
  const contextValue = useMemo(() => ({
    aiRecommendations,
    isGenerating,
    userPreferences,
    aiInsights,
    fetchAIRecommendations,
    trackUserBehavior,
    getSmartDiscount,
    clearCache,
    updateUserPreferences,
    addAIInsight,
  }), [
    aiRecommendations,
    isGenerating,
    userPreferences,
    aiInsights,
    fetchAIRecommendations,
    trackUserBehavior,
    getSmartDiscount,
    clearCache,
    updateUserPreferences,
    addAIInsight,
  ]);

  // Auto-fetch recommendations on mount (if user is logged in)
  useEffect(() => {
    const userId = localStorage.getItem('userId'); // Simulated auth
    if (userId) {
      fetchAIRecommendations(userId);
    }
  }, [fetchAIRecommendations]);

  return (
    <AIContext.Provider value={contextValue}>
      {children}
    </AIContext.Provider>
  );
};

AIProvider.displayName = 'AIProvider';

/**
 * Custom hook to consume AI Context
 * @returns {AIContextType} AI context values and functions
 * @throws {Error} When used outside AIProvider
 */
export const useAI = () => {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
};

/**
 * AI Context - Do not use directly, use useAI() hook instead
 */
const AIContext = createContext({} as any);

export default AIContext;
