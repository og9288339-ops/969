class ShippingService {
  async calculateShipping(weight, destination, service = 'standard') {
    const baseRate = 5.99;
    const weightRate = weight * 0.5;
    const serviceMultiplier = service === 'express' ? 2 : 1;
    const total = (baseRate + weightRate) * serviceMultiplier;
    
    return {
      cost: total,
      estimatedDays: service === 'express' ? 2 : 5,
    };
  }

  async getShippingRates(origin, destination, weight) {
    return [
      { service: 'standard', cost: 5.99, estimatedDays: 5 },
      { service: 'express', cost: 12.99, estimatedDays: 2 },
      { service: 'overnight', cost: 24.99, estimatedDays: 1 },
    ];
  }
}

module.exports = new ShippingService();
