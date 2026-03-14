/**
 * @module paypalService
 * @description Enterprise-grade PayPal REST SDK V2 Integration ($10k+ marketplace)
 * @author Senior Fintech Architect
 * @version 4.0.0
 * @since 2026
 */

import paypal from '@paypal/checkout-server-sdk';
import dotenv from 'dotenv';

dotenv.config();

/**
 * @section Configuration & Environment Setup
 */
const environment = process.env.NODE_ENV === 'production'
  ? new paypal.core.LiveEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET)
  : new paypal.core.SandboxEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET);

const client = new paypal.core.PayPalHttpClient(environment);

/**
 * @section Order Orchestration logic
 * @description Initializes a PayPal transaction and returns the approval link
 */
export const createPaypalOrder = async (totalAmount, orderId) => {
  const request = new paypal.orders.OrdersCreateRequest();
  
  request.prefer("return=representation");
  request.requestBody({
    intent: 'CAPTURE',
    application_context: {
      brand_name: "Enterprise Marketplace",
      landing_page: "BILLING",
      user_action: "PAY_NOW",
      return_url: `${process.env.FRONTEND_URL}/order/success/${orderId}`,
      cancel_url: `${process.env.FRONTEND_URL}/order/payment-failed`
    },
    purchase_units: [{
      reference_id: orderId.toString(),
      description: `Marketplace Order #${orderId}`,
      amount: {
        currency_code: 'USD',
        value: totalAmount.toString(),
        breakdown: {
          item_total: {
            currency_code: 'USD',
            value: totalAmount.toString()
          }
        }
      }
    }]
  });

  try {
    const response = await client.execute(request);
    return response.result;
  } catch (error) {
    console.error("PayPal Order Creation Error:", error.message);
    throw new Error("Financial Gateway Connectivity Issue");
  }
};

/**
 * @section Transaction Finalization
 * @description Executes the payment after user authorization
 */
export const capturePaypalOrder = async (paypalOrderId) => {
  const request = new paypal.orders.OrdersCaptureRequest(paypalOrderId);
  request.requestBody({});

  try {
    const response = await client.execute(request);
    const capture = response.result.purchase_units[0].payments.captures[0];
    
    return {
      success: response.result.status === 'COMPLETED',
      captureId: capture.id,
      transactionData: response.result,
      status: response.result.status
    };
  } catch (error) {
    console.error("PayPal Capture Error:", error.message);
    throw new Error("Payment Capture Authorization Failed");
  }
};

/**
 * @section Post-Transaction Operations
 * @description Handles automated refunds and transaction lookups
 */
export const refundPaypalOrder = async (captureId, amount, reason = "Customer Request") => {
  const request = new paypal.payments.CapturesRefundRequest(captureId);
  
  request.requestBody({
    amount: {
      value: amount.toString(),
      currency_code: 'USD'
    },
    note_to_payer: reason
  });

  try {
    const response = await client.execute(request);
    return response.result;
  } catch (error) {
    console.error("PayPal Refund Processing Error:", error.message);
    throw new Error("Automated Refund Denied by Provider");
  }
};

/**
 * @description Verifies the status of a specific transaction
 */
export const getPaypalOrderDetails = async (orderId) => {
  const request = new paypal.orders.OrdersGetRequest(orderId);
  try {
    const response = await client.execute(request);
    return response.result;
  } catch (error) {
    return null;
  }
};

export default {
  createPaypalOrder,
  capturePaypalOrder,
  refundPaypalOrder,
  getPaypalOrderDetails
};
