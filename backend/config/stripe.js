/**
 * @module stripe
 * @description Production-grade Stripe integration for luxury MERN e-commerce ($10k+ Valuation)
 * @author Senior Backend Architect
 * @version 4.2.0
 * @since 2024
 */

import Stripe from 'stripe';
import crypto from 'crypto';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
  appInfo: {
    name: "Luxury-Ecom-Marketplace",
    version: "4.2.0"
  }
});

/**
 * @description Creates a secure Payment Intent with Idempotency logic
 */
export const createPaymentIntent = async (data) => {
  const { amount, currency, orderId, userId, metadata } = data;

  try {
    // Idempotency Key to prevent double charges
    const idempotencyKey = crypto.createHash('sha256').update(orderId).digest('hex');

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      metadata: {
        ...metadata,
        orderId,
        userId
      },
      automatic_payment_methods: { enabled: true },
    }, {
      idempotencyKey
    });

    return paymentIntent;
  } catch (error) {
    throw new Error(`Stripe Service Error: ${error.message}`);
  }
};

/**
 * @description Verify Stripe Webhook signatures for high-security event handling
 */
export const verifyWebhookSignature = (rawBody, signature) => {
  try {
    return stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    throw new Error(`Webhook Signature Verification Failed: ${error.message}`);
  }
};
