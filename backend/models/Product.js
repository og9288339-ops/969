/**
 * @module Product
 * @description Elite high-performance product model ($10k+ marketplace)
 * @author Senior Database Architect
 * @version 5.0.0
 * @since 2024
 */

import mongoose from 'mongoose';
import slugify from 'slugify';

/**
 * @description Nested Schema for Product Reviews
 */
const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: [true, 'Product name is mandatory'],
      trim: true,
      maxlength: [200, 'Name cannot exceed 200 characters']
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    image: {
      type: String,
      required: [true, 'Main product image is required'],
    },
    images: [String],
    brand: {
      type: String,
      required: [true, 'Brand name is required'],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Product must belong to a category'],
      ref: 'Category',
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
    },
    richDescription: {
      type: String,
      default: '',
    },
    reviews: [reviewSchema],
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    compareAtPrice: {
      type: Number,
      default: 0,
    },
    countInStock: {
      type: Number,
      required: true,
      default: 0,
      min: 0
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    tags: [String],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

/**
 * @description High-Performance Text Index for Global Fuzzy Search
 */
productSchema.index({ name: 'text', brand: 'text', description: 'text', tags: 'text' });

/**
 * @description Pre-save hook: Automatic SEO Slug Generation
 */
productSchema.pre('save', function (next) {
  if (!this.isModified('name')) return next();
  this.slug = slugify(this.name, { 
    lower: true, 
    strict: true,
    replacement: '-' 
  });
  next();
});

/**
 * @description Helper: Discount Calculator (Virtual)
 */
productSchema.virtual('discountPercentage').get(function() {
  if (this.compareAtPrice > this.price) {
    return Math.round(((this.compareAtPrice - this.price) / this.compareAtPrice) * 100);
  }
  return 0;
});

/**
 * @description Middleware to update average rating when a review is added/removed
 */
productSchema.methods.calculateAverageRating = function() {
  if (this.reviews.length === 0) {
    this.rating = 0;
    this.numReviews = 0;
  } else {
    this.numReviews = this.reviews.length;
    const totalRating = this.reviews.reduce((acc, item) => item.rating + acc, 0);
    this.rating = (totalRating / this.reviews.length).toFixed(1);
  }
};

const Product = mongoose.model('Product', productSchema);

export default Product;
