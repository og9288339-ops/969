/**
 * @module stripeService
 * @description Enterprise Financial Gateway ($10k+ Architecture)
 * @author Senior Fintech Architect
 * @version 4.0.0
 * @since 2026
 */

import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

/**
 * @description Creates a secure, idempotent Stripe Checkout Session
 */
export const createCheckoutSession = async (order, userEmail) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: userEmail,
      client_reference_id: order._id.toString(),
      line_items: order.items.map(item => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            images: item.images && item.images.length > 0 ? [item.images[0]] : [],
          },
          unit_amount: Math.round(item.price * 100), 
        },
        quantity: item.quantity,
      })),
      success_url: `${process.env.FRONTEND_URL}/order/success/${order._id}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/order/payment-failed`,
      metadata: { 
        orderId: order._id.toString(),
        userId: order.user ? order.user.toString() : 'guest'
      },
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'EG', 'GB'],
      },
    }, {
      idempotencyKey: `checkout_${order._id.toString()}`,
    });

    return session;
  } catch (error) {
    console.error("Stripe Session Creation Error:", error.message);
    throw new Error(`Stripe Gateway Error: ${error.message}`);
  }
};

/**
 * @description Creates or retrieves a Stripe Customer for persistent payment methods
 */
export const getOrCreateCustomer = async (email, name) => {
  try {
    const existingCustomers = await stripe.customers.list({ email, limit: 1 });
    if (existingCustomers.data.length > 0) return existingCustomers.data[0];

    return await stripe.customers.create({
      email,
      name,
      metadata: { source: 'MERN_Marketplace' }
    });
  } catch (error) {
    console.error("Stripe Customer Management Error:", error.message);
    return null;
  }
};

/**
 * @description Securely verifies Stripe Webhook signatures to prevent spoofing
 */
export const verifyStripeSignature = (rawBody, signature) => {
  try {
    return stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error(`Critical: Webhook Signature Verification Failed: ${error.message}`);
    return null;
  }
};

/**
 * @description Processes full or partial refunds for completed transactions
 */
export const processRefund = async (paymentIntentId, amount, reason = 'requested_by_customer') => {
  try {
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: Math.round(amount * 100),
      reason: reason,
    });
    return { success: true, refundId: refund.id };
  } catch (error) {
    console.error("Stripe Refund Error:", error.message);
    return { success: false, message: error.message };
  }
};

/**
 * @description Retrieves full details of a payment intent
 */
export const getPaymentDetails = async (paymentIntentId) => {
  try {
    return await stripe.paymentIntents.retrieve(paymentIntentId);
  } catch (error) {
    return null;
  }
};

export default {
  createCheckoutSession,
  getOrCreateCustomer,
  verifyStripeSignature,
  processRefund,
  getPaymentDetails
};
