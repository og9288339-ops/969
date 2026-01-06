const stripe = require('../config/stripe');
const paypal = require('paypal-rest-sdk');
const CoinbaseCommerce = require('coinbase-commerce-node').Client;
const client = CoinbaseCommerce(process.env.COINBASE_API_KEY);

paypal.configure({
  mode: 'sandbox', // or 'live'
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_CLIENT_SECRET
});

exports.stripePayment = async (req, res) => {
  const { amount, currency } = req.body;
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency,
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.paypalPayment = (req, res) => {
  const { amount, currency } = req.body;
  const create_payment_json = {
    intent: 'sale',
    payer: { payment_method: 'paypal' },
    redirect_urls: {
      return_url: 'http://localhost:3000/success',
      cancel_url: 'http://localhost:3000/cancel'
    },
    transactions: [{
      amount: { total: amount, currency },
      description: 'Ecommerce purchase'
    }]
  };
  paypal.payment.create(create_payment_json, (error, payment) => {
    if (error) res.status(500).json({ message: error.message });
    else res.json({ approval_url: payment.links[1].href });
  });
};

exports.coinbasePayment = async (req, res) => {
  const { amount, currency } = req.body;
  try {
    const charge = await client.createCharge({
      name: 'Ecommerce Purchase',
      description: 'Payment for products',
      local_price: { amount, currency },
      pricing_type: 'fixed_price'
    });
    res.json({ hosted_url: charge.hosted_url });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};