/**
 * @module coinbaseService
 * @description Enterprise Web3 Crypto Gateway ($10k+ Architecture)
 * @author Senior Blockchain Engineer
 * @version 3.0.0
 * @since 2026
 */

import isy from 'coinbase-commerce-node';
const { Client, resources, Webhook } = isy;
import dotenv from 'dotenv';

dotenv.config();

Client.init(process.env.COINBASE_API_KEY);
const { Charge } = resources;

/**
 * @description Creates a secure cryptocurrency charge with order metadata
 */
export const createCoinbaseCharge = async (orderData) => {
  try {
    const chargeData = {
      name: `Marketplace Order #${orderData._id}`,
      description: `Payment for Order ID: ${orderData._id}`,
      local_price: {
        amount: orderData.totalPrice.toString(),
        currency: 'USD'
      },
      pricing_type: 'fixed_price',
      metadata: {
        orderId: orderData._id.toString(),
        userId: orderData.user.toString(),
        source: 'MERN_Enterprise_Stack'
      },
      redirect_url: `${process.env.FRONTEND_URL}/order/success/${orderData._id}`,
      cancel_url: `${process.env.FRONTEND_URL}/order/payment-failed`,
    };

    const charge = await Charge.create(chargeData);
    return charge;
  } catch (error) {
    console.error("Coinbase Charge Creation Error:", error.message);
    throw new Error("Blockchain Gateway Timeout");
  }
};

/**
 * @description Cryptographically verifies the webhook signature from Coinbase
 */
export const verifyCoinbaseWebhook = (rawBody, signature) => {
  try {
    return Webhook.verifyEventBody(
      rawBody,
      signature,
      process.env.COINBASE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error("Critical: Invalid Webhook Signature Detected");
    return null;
  }
};

/**
 * @description Processes confirmed blockchain transactions and updates order status
 */
export const handleCoinbaseEvent = async (event, updateOrderCallback) => {
  const { type, data } = event;
  const orderId = data.metadata.orderId;

  console.log(`[Crypto-Audit] Processing Event: ${type} for Order: ${orderId}`);

  switch (type) {
    case 'charge:confirmed':
    case 'charge:resolved':
      await updateOrderCallback(orderId, { 
        isPaid: true, 
        paidAt: Date.now(),
        paymentResult: { id: data.id, status: 'confirmed', provider: 'coinbase' }
      });
      break;

    case 'charge:failed':
      await updateOrderCallback(orderId, { isPaid: false, status: 'Payment Failed' });
      break;

    case 'charge:delayed':
      console.warn(`[Delayed Payment] Order ${orderId} received funds after expiration.`);
      break;

    default:
      console.info(`Unhandled Coinbase event type: ${type}`);
  }
};

export default {
  createCoinbaseCharge,
  verifyCoinbaseWebhook,
  handleCoinbaseEvent
};
