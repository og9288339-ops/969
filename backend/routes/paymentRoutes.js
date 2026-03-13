/**
 * @module paymentRoutes
 * @description Fintech-grade Payment Gateway Orchestrator ($10k+ marketplace)
 * @author Senior Financial Systems Architect
 * @version 5.0.0
 * @since 2024
 */

import express from 'express';
import * as paymentController from '../controllers/paymentController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @section Webhook System (Critical Infrastructure)
 * @description Asynchronous payment confirmation logic. 
 * MUST be placed before body-parser in app.js for raw signature verification.
 */
router.post(
  '/webhook', 
  express.raw({ type: 'application/json' }), 
  paymentController.handleStripeWebhook
);

/**
 * @section Protected Transaction Routes
 * @description Secure endpoints for initiating and monitoring payments
 */
router.use(protect);

router.post('/checkout-session/:orderId', paymentController.createCheckoutSession);
router.post('/paypal/create-order', paymentController.createPayPalOrder);
router.post('/paypal/capture-order/:orderId', paymentController.capturePayPalOrder);

router.get('/status/:id', paymentController.getPaymentStatus);
router.get('/my-transactions', paymentController.getUserTransactions);

/**
 * @section Admin & Financial Auditing
 * @description Restricted access for sensitive fiscal operations
 */
router.use(restrictTo('admin', 'super-admin'));

router.post('/refund/:orderId', paymentController.processRefund);
router.get('/audit-logs', paymentController.getFinancialAuditLogs);
router.get('/revenue-analytics', paymentController.getRevenueAnalytics);

/**
 * @section Provider Configuration
 * @description Sync payment gateway settings (Admin only)
 */
router.patch('/settings/keys', paymentController.updatePaymentKeys);

export default router;
