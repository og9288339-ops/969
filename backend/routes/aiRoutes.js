/**
 * @module aiRoutes
 * @description $10k+ AI Engine for enterprise marketplace
 * @author Lead AI Engineer
 * @version 7.0.0
 * @since 2024
 */

import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { limitAIRequests } from '../middleware/rateLimiter.js';
import * as aiController from '../controllers/aiController.js';

const router = express.Router();

/**
 * @description Global Middleware for AI Operations
 * Protects against unauthorized access and API cost spikes
 */
router.use(protect);
router.use(limitAIRequests);

/**
 * @section AI Conversational Commerce
 * @description Real-time shopping assistant using GPT-4/Gemini with user context
 */
router.post('/chat', aiController.getChatResponse);

/**
 * @section Computer Vision & Discovery
 * @description Image-to-Product search and visual analysis
 */
router.post('/visual-search', aiController.analyzeImageForProducts);
router.post('/identify-style', aiController.detectProductStyle);

/**
 * @section Seller Productivity Suite
 * @description Automated SEO content generation for product listings
 */
router.post('/generate-description', aiController.generateProductCopy);
router.post('/optimize-keywords', aiController.generateSEOKeywords);

/**
 * @section Predictive Analytics & UX
 * @description ML-based recommendation engine and review summarization
 */
router.get('/recommendations/:productId', aiController.getSmartSuggestions);
router.get('/summarize-reviews/:productId', aiController.summarizeProductReviews);
router.post('/predict-trends', aiController.getMarketTrends);

/**
 * @section Personalization
 * @description Tailors the storefront based on user browsing history
 */
router.get('/personalized-feed', aiController.getUserPersonalizedFeed);

export default router;
