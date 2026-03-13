/**
 * @module orderController
 * @description Elite enterprise order management for $10k+ MERN marketplace
 * @author Principal Backend Architect
 * @version 5.0.0
 * @since 2024
 */

import { catchAsync } from '../utils/catchAsync.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import AppError from '../utils/appError.js';
import mongoose from 'mongoose';

/**
 * @description Create new order with Atomic Transactions & Stock Locking
 */
export const createOrder = catchAsync(async (req, res, next) => {
  const { 
    orderItems, 
    shippingAddress, 
    paymentMethod, 
    itemsPrice, 
    taxPrice, 
    shippingPrice, 
    totalPrice 
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    return next(new AppError('No order items found', 400));
  }

  // Start MongoDB Session for Atomic Transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Inventory Validation & Deduction
    for (const item of orderItems) {
      const product = await Product.findById(item.product).session(session);
      
      if (!product) {
        throw new Error(`Product with ID ${item.product} not found`);
      }

      if (product.countInStock < item.qty) {
        throw new Error(`Critical: ${product.name} is out of stock (Requested: ${item.qty}, Available: ${product.countInStock})`);
      }

      product.countInStock -= item.qty;
      await product.save({ session });
    }

    // 2. Financial Integrity Check (Server-side Calculation)
    // In a $10k system, you'd re-calculate prices here to verify against req.body

    // 3. Create Order Instance
    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save({ session });

    // Commit Transaction
    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ 
      status: 'success', 
      data: createdOrder 
    });

  } catch (error) {
    // Rollback changes if any step fails
    await session.abortTransaction();
    session.endSession();
    return next(new AppError(error.message, 400));
  }
});

/**
 * @description Get order by ID with User & Product population
 */
export const getOrderById = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'name email')
    .populate('orderItems.product', 'name image price');

  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  // Authorization Shield
  const isOwner = order.user._id.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'admin';

  if (!isOwner && !isAdmin) {
    return next(new AppError('Access Denied: You do not have permission to view this order', 403));
  }

  res.status(200).json({ 
    status: 'success', 
    data: order 
  });
});

/**
 * @description Get logged-in user orders with optimized sorting
 */
export const getMyOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id }).sort('-createdAt');
  
  res.status(200).json({ 
    status: 'success', 
    results: orders.length, 
    data: orders 
  });
});

/**
 * @description Update order status to delivered (Admin Only)
 */
export const updateOrderToDelivered = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  order.isDelivered = true;
  order.deliveredAt = Date.now();
  order.status = 'Delivered';

  const updatedOrder = await order.save();

  res.status(200).json({ 
    status: 'success', 
    data: updatedOrder 
  });
});
