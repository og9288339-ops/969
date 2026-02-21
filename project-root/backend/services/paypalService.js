const paypal = require('paypal-rest-sdk');

paypal.configure({
  mode: process.env.PAYPAL_MODE || 'sandbox',
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_CLIENT_SECRET,
});

class PayPalService {
  async createPayment(amount, currency = 'USD') {
    const create_payment_json = {
      intent: 'sale',
      payer: {
        payment_method: 'paypal',
      },
      redirect_urls: {
        return_url: `${process.env.FRONTEND_URL}/success`,
        cancel_url: `${process.env.FRONTEND_URL}/cancel`,
      },
      transactions: [
        {
          amount: {
            total: amount.toString(),
            currency,
          },
          description: 'Ecommerce purchase',
        },
      ],
    };

    return new Promise((resolve, reject) => {
      paypal.payment.create(create_payment_json, (error, payment) => {
        if (error) {
          reject(new Error('PayPal payment creation failed'));
        } else {
          resolve(payment.links.find(link => link.rel === 'approval_url').href);
        }
      });
    });
  }

  async executePayment(paymentId, payerId) {
    const execute_payment_json = {
      payer_id: payerId,
    };

    return new Promise((resolve, reject) => {
      paypal.payment.execute(paymentId, execute_payment_json, (error, payment) => {
        if (error) {
          reject(new Error('PayPal payment execution failed'));
        } else {
          resolve(payment);
        }
      });
    });
  }
}

module.exports = new PayPalService();
