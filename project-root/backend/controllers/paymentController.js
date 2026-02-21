const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const paypal = require('paypal-rest-sdk');
const { Client } = require('coinbase-commerce-node');
const client = Client.init(process.env.COINBASE_API_KEY);

paypal.configure({
  mode: process.env.PAYPAL_MODE || 'sandbox',
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_CLIENT_SECRET
});

exports.stripePayment = async (req, res) => {
  const { amount, currency } = req.body;
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: currency || 'usd',
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
      return_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`
    },
    transactions: [{
      amount: { total: amount.toString(), currency: currency || 'USD' },
      description: 'Ecommerce purchase'
    }]
  };
  paypal.payment.create(create_payment_json, (error, payment) => {
    if (error) {
      res.status(500).json({ message: error.message });
    } else {
      const approval_url = payment.links.find(link => link.rel === 'approval_url').href;
      res.json({ approval_url });
    }
  });
};

exports.coinbasePayment = async (req, res) => {
  const { amount, currency } = req.body;
  try {
    const charge = await client.charge.create({
      name: 'Ecommerce Purchase',
      description: 'Payment for products',
      local_price: { amount, currency: currency || 'USD' },
      pricing_type: 'fixed_price'
    });
    res.json({ hosted_url: charge.hosted_url });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
