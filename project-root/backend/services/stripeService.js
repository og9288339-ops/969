const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

class StripeService {
  async createPaymentIntent(amount, currency = 'usd') {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency,
        payment_method_types: ['card'],
      });
      return paymentIntent;
    } catch (error) {
      throw new Error('Stripe payment intent creation failed');
    }
  }

  async confirmPayment(paymentIntentId) {
    try {
      const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId);
      return paymentIntent;
    } catch (error) {
      throw new Error('Stripe payment confirmation failed');
    }
  }
}

module.exports = new StripeService();
