/**
 * @module validator
 * @description Enterprise-grade Joi validation middleware for MERN marketplace
 * @author Senior Backend Architect
 * @version 3.0.0
 * @since 2024
 */

import Joi from 'joi';
import logger from './logger.js';

/**
 * @typedef {Object} ValidationError
 * @property {number} statusCode - HTTP status
 * @property {string} message - User-friendly error
 * @property {Object} errors - Field-specific errors
 */

/**
 * Generic validation middleware factory
 * @param {Joi.ObjectSchema} schema - Joi validation schema
 * @param {('body'|'query'|'params')} location - Request location to validate
 * @returns {Function} Express middleware
 */
const validate = (schema, location = 'body') => {
  return (req, res, next) => {
    const data = req[location];

    // Validate against Joi schema
    const { error, value } = schema.validate(data, {
      abortEarly: false, // Report all errors
      stripUnknown: true, // Remove unknown fields
      escapeHtml: true,   // XSS protection
    });

    if (error) {
      // Log validation failure (security audit)
      logger.warn('Validation failed', {
        correlationId: req.id,
        endpoint: req.originalUrl,
        method: req.method,
        location,
        errors: error.details.map(d => ({
          field: d.path.join('.'),
          message: d.message,
        })),
      });

      // Format clean error response
      const formattedErrors = error.details.reduce((acc, err) => {
        const path = err.path.join('.');
        acc[path] = err.message.replace('"" is required', 'is required');
        return acc;
      }, {});

      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'Validation failed',
        errors: formattedErrors,
      });
    }

    // Replace validated data
    req[location] = value;
    next();
  };
};

/**
 * Joi ObjectId validator
 */
const objectId = Joi.string().custom((value, helpers) => {
  if (!/^[0-9a-fA-F]{24}$/.test(value)) {
    return helpers.error('any.invalid');
  }
  return value;
}, 'ObjectId validation');

/**
 * ========================================
 * AUTHENTICATION SCHEMAS
 * ========================================
 */

/**
 * User Registration Schema (Security-First)
 */
const registerSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .pattern(/^[a-zA-Z\s]+$/)
    .required()
    .messages({
      'string.min': 'Name must be at least 2 characters',
      'string.max': 'Name cannot exceed 50 characters',
      'string.pattern.base': 'Name can only contain letters and spaces',
    }),
  email: Joi.string()
    .trim()
    .email({ tlds: { allow: false } })
    .lowercase()
    .required()
    .messages({
      'string.email': 'Please enter a valid email address',
    }),
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters',
      'string.pattern.base': 'Password must contain uppercase, lowercase, number, and special character',
    }),
  phone: Joi.string()
    .pattern(/^\+?[\d\s\-\$\$]{10,}$/)
    .allow('')
    .messages({
      'string.pattern.base': 'Please enter a valid phone number',
    }),
});

/**
 * User Login Schema
 */
const loginSchema = Joi.object({
  email: Joi.string()
    .trim()
    .email({ tlds: { allow: false } })
    .lowercase()
    .required(),
  password: Joi.string().min(1).required(),
});

/**
 * ========================================
 * PRODUCT MANAGEMENT SCHEMAS
 * ========================================
 */

/**
 * Create/Update Product Schema
 */
const productSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(3)
    .max(100)
    .required(),
  slug: Joi.string()
    .trim()
    .lowercase()
    .min(3)
    .max(100)
    .pattern(/^[a-z0-9-]+$/),
  description: Joi.string().min(10).max(2000),
  richDescription: Joi.string().allow(''),
  brand: Joi.string().trim().max(50),
  category: objectId.required(),
  price: Joi.number()
    .min(0.01)
    .max(10000000)
    .precision(2)
    .required(),
  countInStock: Joi.number().min(0).max(10000).default(0),
  images: Joi.array()
    .items(Joi.string().uri())
    .min(1)
    .max(10),
  isFeatured: Joi.boolean().default(false),
});

/**
 * ========================================
 * ORDER & PAYMENT SCHEMAS
 * ========================================
 */

/**
 * Create Order Schema
 */
const orderSchema = Joi.object({
  orderItems: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().required(),
        quantity: Joi.number().min(1).max(100).required(),
        image: Joi.string().uri().required(),
        price: Joi.number().min(0.01).required(),
        product: objectId.required(),
      })
    )
    .min(1)
    .required(),
  shippingAddress: Joi.object({
    address: Joi.string().min(5).max(200).required(),
    city: Joi.string().min(2).max(50).required(),
    postalCode: Joi.string().min(3).max(10).required(),
    country: Joi.string().min(2).max(50).required(),
  }).required(),
  paymentMethod: Joi.string().valid('card', 'paypal', 'crypto', 'cod').required(),
});

/**
 * Payment Intent Schema
 */
const paymentSchema = Joi.object({
  orderId: objectId.required(),
  amount: Joi.number().min(0.01).required(),
  currency: Joi.string().valid('usd', 'eur', 'egp').default('usd'),
});

/**
 * ========================================
 * USER PROFILE SCHEMAS
 * ========================================
 */

const profileSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50),
  phone: Joi.string().pattern(/^\+?[\d\s\-\$\$]{10,}$/).allow(''),
});

/**
 * ========================================
 * EXPORTS
 * ========================================
 */

// Middleware factory
export const validateBody = (schema) => validate(schema, 'body');
export const validateQuery = (schema) => validate(schema, 'query');
export const validateParams = (schema) => validate(schema, 'params');

// Pre-defined schemas
export const schemas = {
  register: registerSchema,
  login: loginSchema,
  product: productSchema,
  order: orderSchema,
  payment: paymentSchema,
  profile: profileSchema,
};

export default validate;
