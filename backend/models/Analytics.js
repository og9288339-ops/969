const mongoose = require('mongoose');

const AnalyticsSchema = new mongoose.Schema({
  totalUsers: {
    type: Number,
    default: 0
  },
  totalProducts: {
    type: Number,
    default: 0
  },
  totalOrders: {
    type: Number,
    default: 0
  },
  totalRevenue: {
    type: Number,
    default: 0
  },
  monthlyRevenue: [{
    month: String,
    revenue: Number
  }],
  topProducts: [{
    product: {
      type: mongoose.Schema.ObjectId,
      ref: 'Product'
    },
    sales: Number
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Analytics', AnalyticsSchema);