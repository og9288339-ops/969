/**
 * @module analyticsController
 * @description Advanced Business Intelligence & Sales Analytics ($10k+ Marketplace)
 * @author Principal Data Engineer
 * @version 3.5.0
 * @since 2024
 */

import Order from '../models/Order.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import { catchAsync } from '../utils/catchAsync.js';

/**
 * @description Get Overall Dashboard Statistics (Executive View)
 * Optimized via Single-Pass Aggregation
 */
export const getDashboardStats = catchAsync(async (req, res, next) => {
  const stats = await Order.aggregate([
    {
      $group: {
        _id: null,
        totalSales: { $sum: '$totalPrice' },
        totalOrders: { $sum: 1 },
        avgOrderValue: { $avg: '$totalPrice' }
      }
    }
  ]);

  const userCount = await User.countDocuments();
  const productCount = await Product.countDocuments();
  const outOfStockProducts = await Product.countDocuments({ countInStock: 0 });

  res.status(200).json({
    status: 'success',
    data: {
      totalRevenue: stats[0]?.totalSales || 0,
      totalOrders: stats[0]?.totalOrders || 0,
      averageOrderValue: stats[0]?.avgOrderValue || 0,
      totalUsers: userCount,
      totalProducts: productCount,
      inventoryAlert: outOfStockProducts
    }
  });
});

/**
 * @description Get Monthly Sales Growth (Time-Series for Charts)
 */
export const getSalesChartData = catchAsync(async (req, res, next) => {
  const salesData = await Order.aggregate([
    {
      $match: { isPaid: true }
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m", date: "$paidAt" } },
        revenue: { $sum: "$totalPrice" },
        orderCount: { $sum: 1 }
      }
    },
    { $sort: { "_id": 1 } }
  ]);

  res.status(200).json({ status: 'success', data: salesData });
});

/**
 * @description Get Category Distribution (Inventory & Market Insights)
 */
export const getCategoryStats = catchAsync(async (req, res, next) => {
  const categoryData = await Product.aggregate([
    {
      $group: {
        _id: "$category",
        productCount: { $sum: 1 },
        avgPrice: { $avg: "$price" }
      }
    },
    { $sort: { productCount: -1 } }
  ]);

  res.status(200).json({ status: 'success', data: categoryData });
});

/**
 * @description Get Top Selling Products by Revenue
 */
export const getTopSellingProducts = catchAsync(async (req, res, next) => {
  const topProducts = await Order.aggregate([
    { $match: { isPaid: true } },
    { $unwind: "$orderItems" },
    {
      $group: {
        _id: "$orderItems.product",
        name: { $first: "$orderItems.name" },
        totalQty: { $sum: "$orderItems.qty" },
        totalRevenue: { $sum: { $multiply: ["$orderItems.qty", "$orderItems.price"] } }
      }
    },
    { $sort: { totalRevenue: -1 } },
    { $limit: 5 }
  ]);

  res.status(200).json({ status: 'success', data: topProducts });
});

/**
 * @description Get Recent Order Activity for Admin Live Feed
 */
export const getRecentActivity = catchAsync(async (req, res, next) => {
  const recentOrders = await Order.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('user', 'name email')
    .lean();

  res.status(200).json({ status: 'success', data: recentOrders });
});
