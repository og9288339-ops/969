/**
 * @module helpers
 * @description Enterprise Utility Library ($10k+ Architecture)
 * @author Senior Backend Architect
 * @version 4.0.0
 * @since 2026
 */

import crypto from 'crypto';

/**
 * @section Financial & Formatting Utilities
 */

export const formatCurrency = (amount, currency = 'USD', locale = 'en-US') => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

export const calculateDiscount = (originalPrice, salePrice) => {
  if (!originalPrice || originalPrice <= 0) return 0;
  const discount = ((originalPrice - salePrice) / originalPrice) * 100;
  return Math.round(discount);
};

/**
 * @section Security & Cryptography
 */

export const generateSecureCode = (length = 6) => {
  return crypto.randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length)
    .toUpperCase();
};

export const hashData = (data) => {
  return crypto.createHash('sha256').update(data).digest('hex');
};

/**
 * @section SEO & String Manipulation
 */

export const slugify = (text) => {
  const slug = text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') 
    .replace(/[^\w\u0621-\u064A-]+/g, '') 
    .replace(/--+/g, '-');
    
  return slug || 'product-' + Date.now();
};

export const truncateText = (text, limit = 100) => {
  if (!text) return "";
  if (text.length <= limit) return text;
  return text.slice(0, limit).trim() + '...';
};

/**
 * @section Logistics & Time Intelligence
 */

export const calculateDeliveryDate = (daysToAdd) => {
  let date = new Date();
  let addedDays = 0;
  while (addedDays < daysToAdd) {
    date.setDate(date.getDate() + 1);
    // Skip Fridays and Saturdays (Customized for Egypt/MENA region)
    if (date.getDay() !== 5 && date.getDay() !== 6) {
      addedDays++;
    }
  }
  return date;
};

export const getRelativeTime = (date) => {
  const formatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  const divisions = [
    { amount: 60, name: 'seconds' },
    { amount: 60, name: 'minutes' },
    { amount: 24, name: 'hours' },
    { amount: 7, name: 'days' },
    { amount: 4.345, name: 'weeks' },
    { amount: 12, name: 'months' },
    { amount: Number.POSITIVE_INFINITY, name: 'years' }
  ];

  let duration = (new Date(date) - new Date()) / 1000;
  for (let i = 0; i <= divisions.length; i++) {
    const division = divisions[i];
    if (Math.abs(duration) < division.amount) {
      return formatter.format(Math.round(duration), division.name);
    }
    duration /= division.amount;
  }
};

/**
 * @section Data Structures & Pagination
 */

export const paginate = (items, page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  return items.slice(offset, offset + limit);
};

export const cleanObject = (obj) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v != null && v !== "")
  );
};

export default {
  formatCurrency,
  calculateDiscount,
  generateSecureCode,
  hashData,
  slugify,
  truncateText,
  calculateDeliveryDate,
  getRelativeTime,
  paginate,
  cleanObject
};
