/**
 * @module adminController
 * @description Senior-level admin API controller for luxury MERN e-commerce ($10k+ Valuation)
 * @author Senior Backend Architect
 * @version 4.0.0
 * @since 2024
 */

import { catchAsync } from '../utils/catchAsync.js';
import User from '../models/User.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import AppError from '../utils/appError.js';

/**
 * @description Get high-level Dashboard Analytics using MongoDB Aggregation
 */
export const getDashboardStats = catchAsync(async (req, res, next) => {
  const stats = await Order.aggregate([
    {
      $facet: {
        totalRevenue: [
          { $group: { _id: null, total: { $sum: '$totalPrice' } } }
        ],
        monthlySales: [
          {
            $group: {
              _id: { $month: '$createdAt' },
              count: { $sum: 1 },
              revenue: { $sum: '$totalPrice' }
            }
          },
          { $sort: { '_id': 1 } }
        ],
        orderStatus: [
          { $group: { _id: '$status', count: { $sum: 1 } } }
        ]
      }
    }
  ]);

  const userCount = await User.countDocuments();
  const productCount = await Product.countDocuments();

  res.status(200).json({
    status: 'success',
    data: {
      revenue: stats[0].totalRevenue[0]?.total || 0,
      monthlySales: stats[0].monthlySales,
      orderStatus: stats[0].orderStatus,
      users: userCount,
      products: productCount
    }
  });
});

/**
 * @description Manage all registered users (Excludes passwords)
 */
export const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find().select('-password');
  
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: { users }
  });
});

/**
 * @description Update order status (Processing, Shipped, Delivered, Cancelled)
 */
export const updateOrderStatus = catchAsync(async (req, res, next) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id, 
    { status: req.body.status },
    { new: true, runValidators: true }
  );

  if (!order) {
    return next(new AppError('No order found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { order }
  });
});

/**
 * @description Admin-only user deletion logic
 */
export const deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});
