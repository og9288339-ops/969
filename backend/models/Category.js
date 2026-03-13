/**
 * @module Category
 * @description Amazon-style hierarchical category model with SEO Slugs
 * @author Senior Database Architect
 * @version 3.0.0
 * @since 2024
 */

import mongoose from 'mongoose';
import slugify from 'slugify';

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true,
      trim: true,
      maxlength: [32, 'Category name is too long'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
    },
    image: {
      type: String,
      default: 'default-category.png',
    },
    icon: {
      type: String,
      default: 'tag-icon',
    },
    description: {
      type: String,
      trim: true,
      maxlength: [200, 'Description cannot exceed 200 characters'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

/**
 * @description Indexing for high-performance search
 */
categorySchema.index({ name: 'text', slug: 1 });

/**
 * @description Pre-save middleware to auto-generate SEO-friendly slug
 */
categorySchema.pre('save', function (next) {
  if (!this.isModified('name')) return next();
  this.slug = slugify(this.name, { 
    lower: true, 
    strict: true,
    replacement: '-' 
  });
  next();
});

/**
 * @description Virtual populate to fetch sub-categories (Children)
 */
categorySchema.virtual('children', {
  ref: 'Category',
  foreignField: 'parentId',
  localField: '_id',
});

/**
 * @description Ensure that when a category is deleted, child categories references are handled
 */
categorySchema.pre('findOneAndDelete', async function (next) {
  const docToByDeleted = await this.model.findOne(this.getQuery());
  if (docToByDeleted) {
    await this.model.updateMany(
      { parentId: docToByDeleted._id },
      { $set: { parentId: null } }
    );
  }
  next();
});

const Category = mongoose.model('Category', categorySchema);

export default Category;
