/**
 * @module stripe
 * @description Production-grade Stripe integration for luxury MERN e-commerce
 * @author Senior Backend Architect
 * @version 4.2.0
 * @since 2024
 */

import Stripe from 'stripe';
import crypto from 'crypto';

/**
 * @typedef {Object} PaymentIntentData
 * @property {string} orderId - Unique order ID
 * @property {string} userId - User ID
 * @property {number} amount - Amount in cents
 * @property {string} currency - Currency code (usd, egp, eur)
 * @property {Object} metadata - Additional metadata
 */

/**
 * Stripe instance
