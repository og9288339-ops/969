/**
 * @module orderRoutes
 * @description High-reliability Financial Logistics Engine ($10k+ marketplace)
 * @author Senior Backend Architect
 * @version 4.0.0
 * @since 2024
 */

import express from 'express';
import * as orderController from '../controllers/orderController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @description Global Protection Layer
 * All order operations require a verified user session
 */
router.use(protect);

/**
 * @section Customer Order Management
 * @description Routes for placing orders and tracking personal purchase history
 */
router.route('/')
  .post(orderController.createOrder)
  .get(orderController.getMyOrders);

router.get('/mine', orderController.getMyOrders); // Alias for convenience

router.route('/:id')
  .get(orderController.getOrderById);

/**
 * @section Payment & Transaction Processing
 * @description Integration points for finalizing financial transactions
 */
router.patch('/:id/pay', orderController.updateOrderToPaid);
router.patch('/:id/cancel', orderController.cancelOrder);

/**
 * @section Admin Logistics & Audit Control
 * @description Restricted routes for global order fulfillment and financial auditing
 */
router.use(restrictTo('admin', 'super-admin'));

router.route('/')
  .get(orderController.getAllOrders);

router.route('/:id/status')
  .patch(orderController.updateOrderStatus);

router.patch('/:id/ship', orderController.updateOrderToShipped);
router.patch('/:id/deliver', orderController.updateOrderToDelivered);

/**
 * @section Business Intelligence & Reporting
 */
router.get('/admin/summary', orderController.getOrderStats);
router.get('/admin/revenue', orderController.getRevenueData);

export default router;
