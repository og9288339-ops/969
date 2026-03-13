/**
 * @module adminRoutes
 * @description Zero-Trust admin command center ($10k+ marketplace)
 * @author Principal Infrastructure Architect
 * @version 6.0.0
 * @since 2024
 */

import express from 'express';
import { protect, restrictTo } from '../middleware/authMiddleware.js';
import * as userController from '../controllers/userController.js';
import * as productController from '../controllers/productController.js';
import * as orderController from '../controllers/orderController.js';
import * as analyticsController from '../controllers/analyticsController.js';

const router = express.Router();

/**
 * @description Global Protection Layer
 * Ensures all subsequent routes are locked behind JWT and Admin Role
 */
router.use(protect);
router.use(restrictTo('admin', 'super-admin'));

/**
 * @section Business Intelligence & Analytics
 */
router.get('/stats/summary', analyticsController.getDashboardStats);
router.get('/stats/sales-report', analyticsController.getSalesReport);
router.get('/stats/top-products', analyticsController.getTopSellingProducts);

/**
 * @section User Management (RBAC)
 */
router.route('/users')
  .get(userController.getAllUsers)
  .post(userController.createUserByAdmin);

router.route('/users/:id')
  .get(userController.getUserDetails)
  .patch(userController.updateUserRole)
  .delete(userController.deleteUser);

/**
 * @section Inventory & Catalog Control
 */
router.route('/products')
  .get(productController.getAdminProducts)
  .post(productController.createProduct);

router.route('/products/:id')
  .patch(productController.updateProduct)
  .delete(productController.deleteProduct);

router.patch('/products/:id/stock', productController.updateStockLevel);

/**
 * @section Order Logistics & Financial Auditing
 */
router.route('/orders')
  .get(orderController.getAllOrders);

router.route('/orders/:id')
  .get(orderController.getOrderDetails)
  .patch(orderController.updateOrderStatus);

router.patch('/orders/:id/deliver', orderController.updateOrderToDelivered);
router.post('/orders/:id/refund', orderController.processAdminRefund);

/**
 * @section Content Moderation
 */
router.delete('/reviews/:id', productController.deleteReview);

export default router;
