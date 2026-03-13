/**
 * @module productController
 * @description Elite senior-level product API for $10k+ marketplace
 * @author Silicon Valley Lead Engineer
 * @version 5.1.0
 * @since 2024
 */

import Product from '../models/Product.js';
import { catchAsync } from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

/**
 * @description Fetch all products with Advanced Filtering, Sorting & Pagination
 * Optimized with .lean() for high-speed read operations
 */
export const getProducts = catchAsync(async (req, res, next) => {
  const pageSize = Number(req.query.pageSize) || 12;
  const page = Number(req.query.pageNumber) || 1;

  // Smart Keyword Search (Fuzzy-ish via Regex)
  const keyword = req.query.keyword 
    ? { name: { $regex: req.query.keyword, $options: 'i' } } 
    : {};

  // Advanced Filtering (Category & Price Range)
  const category = req.query.category ? { category: req.query.category } : {};
  const priceFilter = req.query.minPrice || req.query.maxPrice 
    ? { 
        price: { 
          $gte: Number(req.query.minPrice) || 0, 
          $lte: Number(req.query.maxPrice) || 999999 
        } 
      } 
    : {};

  const count = await Product.countDocuments({ ...keyword, ...category, ...priceFilter });

  const products = await Product.find({ ...keyword, ...category, ...priceFilter })
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort({ createdAt: -1 })
    .lean();

  res.status(200).json({ 
    status: 'success', 
    data: { 
      products, 
      page, 
      pages: Math.ceil(count / pageSize), 
      total: count 
    } 
  });
});

/**
 * @description Get Single Product by ID
 */
export const getProductById = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id).lean();

  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  res.status(200).json({ status: 'success', data: product });
});

/**
 * @description Create Product Review & Auto-Recalculate Ratings
 * Includes integrity check to prevent multiple reviews from same user
 */
export const createProductReview = catchAsync(async (req, res, next) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);

  if (!product) return next(new AppError('Product not found', 404));

  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );

  if (alreadyReviewed) return next(new AppError('Product already reviewed', 400));

  const review = {
    name: req.user.name,
    rating: Number(rating),
    comment,
    user: req.user._id,
  };

  product.reviews.push(review);
  product.numReviews = product.reviews.length;
  product.rating = 
    product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

  await product.save();
  res.status(201).json({ status: 'success', message: 'Review added successfully' });
});

/**
 * @description Admin: Create New Product
 */
export const createProduct = catchAsync(async (req, res, next) => {
  const product = new Product({
    name: 'Sample Name',
    price: 0,
    user: req.user._id,
    image: '/images/sample.jpg',
    brand: 'Sample Brand',
    category: 'Sample Category',
    countInStock: 0,
    numReviews: 0,
    description: 'Sample Description',
  });

  const createdProduct = await product.save();
  res.status(201).json({ status: 'success', data: createdProduct });
});

/**
 * @description Admin: Update Product Details
 */
export const updateProduct = catchAsync(async (req, res, next) => {
  const { name, price, description, image, brand, category, countInStock } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name || product.name;
    product.price = price || product.price;
    product.description = description || product.description;
    product.image = image || product.image;
    product.brand = brand || product.brand;
    product.category = category || product.category;
    product.countInStock = countInStock || product.countInStock;

    const updatedProduct = await product.save();
    res.status(200).json({ status: 'success', data: updatedProduct });
  } else {
    return next(new AppError('Product not found', 404));
  }
});

/**
 * @description Admin: Delete Product
 */
export const deleteProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  res.status(204).json({ status: 'success', data: null });
});

/**
 * @description Get Top Rated Products (High-conversion logic)
 */
export const getTopProducts = catchAsync(async (req, res, next) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(3).lean();
  res.status(200).json({ status: 'success', data: products });
});
