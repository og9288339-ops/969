const { Client, resources } = require('coinbase-commerce-node');

Client.init(process.env.COINBASE_API_KEY);

class CoinbaseService {
  async createCharge(amount, currency = 'USD') {
    try {
      const charge = await resources.Charge.create({
        name: 'Ecommerce Purchase',
        description: 'Payment for products',
        local_price: {
          amount: amount.toString(),
          currency,
        },
        pricing_type: 'fixed_price',
      });
      return charge;
    } catch (error) {
      throw new Error('Coinbase charge creation failed');
    }
  }

  async getCharge(chargeId) {
    try {
      const charge = await resources.Charge.retrieve(chargeId);
      return charge;
    } catch (error) {
      throw new Error('Coinbase charge retrieval failed');
    }
  }
}

module.exports = new CoinbaseService();