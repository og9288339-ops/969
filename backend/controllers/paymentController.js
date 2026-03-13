/**
 * @module paymentController
 * @description High-security payment controller for $10k+ MERN marketplace
 * @author Principal Backend Architect
 * @version 5.0.0
 * @since 2024
 */

import Stripe from 'stripe';
import { catchAsync } from '../utils/catchAsync.js';
import Order from '../models/Order.js';
import AppError from '../utils/appError.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * @description Create Stripe Payment Intent with Server-Side Price Verification
 * Prevents price tampering by fetching total from DB via orderId
 */
export const createPaymentIntent = catchAsync(async (req, res, next) => {
  const { orderId } = req.body;

  const order = await Order.findById(orderId);
  if (!order) {
    return next(new AppError('No order found with that ID', 404));
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(order.totalPrice * 100), // Convert to Cents
    currency: 'usd',
    metadata: { 
      orderId: order._id.toString(),
      userId: req.user._id.toString() 
    },
    automatic_payment_methods: { enabled: true },
  });

  res.status(200).json({
    status: 'success',
    clientSecret: paymentIntent.client_secret,
  });
});

/**
 * @description High-Security Webhook to confirm payment from Stripe directly
 * Uses Signature Verification to ensure request authenticity
 */
export const stripeWebhook = catchAsync(async (req, res, next) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const session = event.data.object;
    const orderId = session.metadata.orderId;

    const order = await Order.findById(orderId);
    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: session.id,
        status: session.status,
        email_address: session.receipt_email || req.user?.email,
      };
      await order.save();
    }
  }

  res.status(200).json({ received: true });
});

/**
 * @description Get Stripe Publishable Key for Frontend
 */
export const getStripeConfig = catchAsync(async (req, res, next) => {
  res.status(200).json({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
});
