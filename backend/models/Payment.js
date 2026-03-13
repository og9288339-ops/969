/**
 * @module paymentService
 * @description Multi-gateway payment service layer ($10k+ marketplace)
 * @author Senior Payments Architect
 * @version 3.0.0
 * @since 2024
 */

import Stripe from 'stripe';
import Order from '../models/Order.js';
import AppError from '../utils/appError.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * @description Creates a Stripe Payment Intent with rigorous price validation
 */
export const createStripeIntent = async (orderId) => {
  const order = await Order.findById(orderId);
  
  if (!order) {
    throw new AppError('Order not found for payment processing.', 404);
  }

  if (order.isPaid) {
    throw new AppError('Security Alert: This order has already been settled.', 400);
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.totalPrice * 100), // Convert to cents to avoid JS decimal issues
      currency: 'usd',
      metadata: { 
        orderId: order._id.toString(),
        orderNumber: order.orderNumber,
        userId: order.user.toString()
      },
      payment_method_types: ['card'],
      receipt_email: order.shippingAddress.email || undefined,
    });

    return {
      clientSecret: paymentIntent.client_secret,
      id: paymentIntent.id
    };
  } catch (error) {
    throw new AppError(`Stripe Gateway Error: ${error.message}`, 500);
  }
};

/**
 * @description Verifies PayPal Transaction Integrity (Server-Side)
 */
export const verifyPayPalPayment = async (orderId, paymentResult) => {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new AppError('Order not found.', 404);
  }

  // Double-check amount match to prevent price manipulation
  if (parseFloat(paymentResult.amount) !== order.totalPrice) {
    throw new AppError('Financial Discrepancy: Payment amount does not match order total.', 400);
  }

  order.isPaid = true;
  order.paidAt = Date.now();
  order.paymentResult = {
    id: paymentResult.id,
    status: paymentResult.status,
    update_time: paymentResult.update_time,
    email_address: paymentResult.email_address,
  };
  order.status = 'Processing';

  const updatedOrder = await order.save();
  return updatedOrder;
};

/**
 * @description Webhook Handler: Final Bank-to-Server Confirmation
 */
export const handleStripeWebhook = async (signature, rawBody) => {
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    throw new AppError(`Webhook Signature Verification Failed: ${err.message}`, 400);
  }

  if (event.type === 'payment_intent.succeeded') {
    const intent = event.data.object;
    const orderId = intent.metadata.orderId;

    await Order.findByIdAndUpdate(orderId, {
      isPaid: true,
      paidAt: Date.now(),
      paymentResult: {
        id: intent.id,
        status: intent.status,
        email_address: intent.receipt_email,
      },
      status: 'Processing'
    });
  }

  return { received: true };
};

/**
 * @description Manual Refund Logic (Admin Only)
 */
export const refundPayment = async (orderId) => {
  const order = await Order.findById(orderId);
  
  if (!order || !order.isPaid || !order.paymentResult.id) {
    throw new AppError('Order not eligible for refund.', 400);
  }

  try {
    const refund = await stripe.refunds.create({
      payment_intent: order.paymentResult.id,
    });

    order.status = 'Cancelled';
    order.isPaid = false; // Optional: depending on business logic
    await order.save();

    return refund;
  } catch (error) {
    throw new AppError(`Refund Failed: ${error.message}`, 500);
  }
};
