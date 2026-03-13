/**
 * @module productRoutes
 * @description Advanced Catalog Discovery System ($10k+ marketplace)
 * @author Senior Product Architect
 * @version 5.0.0
 * @since 2024
 */

import express from 'express';
import * as productController from '../controllers/productController.js';
import * as reviewController from '../controllers/reviewController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @section Public Discovery (SEO Optimized)
 */
router.get('/', productController.getAllProducts);
router.get('/top-5-cheap', productController.aliasTopProducts, productController.getAllProducts);
router.get('/slug/:slug', productController.getProductBySlug);
router.get('/:id', productController.getProduct);

/**
 * @section Social Proof (Reviews)
 */
router.get('/:productId/reviews', reviewController.getReviews);

/**
 * @section Search & Filtering
 */
router.get('/search/suggestions', productController.getProductSuggestions);
router.get('/categories/list', productController.getAllCategories);

/**
 * @section Protected Customer Actions
 */
router.use(protect);

router.post('/:productId/reviews', reviewController.createReview);
router.post('/wishlist/:id', productController.toggleWishlist);

/**
 * @section Admin & Seller Inventory Control
 */
router.use(restrictTo('admin', 'seller', 'super-admin'));

router.route('/')
  .post(productController.createProduct);

router.route('/:id')
  .patch(productController.updateProduct)
  .delete(productController.deleteProduct);

/**
 * @section Supply Chain & Stock Management
 */
router.patch('/:id/update-stock', productController.updateStockLevel);
router.get('/admin/inventory-stats', productController.getInventoryReport);

export default router;
