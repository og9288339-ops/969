/**
 * @module authRoutes
 * @description Enterprise-grade Unified Authentication System ($10k+ marketplace)
 * @author Senior Security Architect
 * @version 6.0.0
 * @since 2024
 */

import express from 'express';
import * as authController from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { loginRateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

/**
 * @section Entry Points
 * @description Public routes for user onboarding and session initiation
 */
router.post('/register', authController.register);
router.post('/login', loginRateLimiter, authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authController.logout);

/**
 * @section Social Authentication (OAuth 2.0)
 * @description High-conversion social login integration points
 */
router.post('/google-login', authController.googleLogin);
router.post('/facebook-login', authController.facebookLogin);

/**
 * @section Account Recovery & Integrity
 * @description Secure hashed-token flow for password management
 */
router.post('/forgot-password', authController.forgotPassword);
router.patch('/reset-password/:token', authController.resetPassword);
router.get('/verify-email/:token', authController.verifyEmail);
router.post('/resend-verification', authController.resendVerificationEmail);

/**
 * @section Secure Identity Management
 * @description Protected routes requiring active session verification
 */
router.use(protect);

router.get('/me', authController.getMe);
router.patch('/update-password', authController.updatePassword);
router.patch('/update-me', authController.updateMe);
router.delete('/delete-me', authController.deleteMe);

/**
 * @section Multi-Factor Authentication (MFA)
 * @description Optional security layer for high-value accounts
 */
router.post('/mfa/enable', authController.enableMFA);
router.post('/mfa/verify', authController.verifyMFA);
router.post('/mfa/disable', authController.disableMFA);

export default router;
