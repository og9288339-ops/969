/**
 * @module formatCurrency
 * @description Enterprise-grade currency formatting ($10k+ luxury marketplace)
 * @author Senior Frontend Architect & Global Architect
 * @version 2.0.0
 */

/**
 * Formats currency with luxury precision and international standards.
 * @param {number|string|null|undefined} amount - Amount to format
 * @param {string} [currency='USD'] - Currency code (USD, EUR, EGP, BTC)
 * @param {string} [locale='en-US'] - Locale for formatting
 */
export const formatCurrency = (amount, currency = 'USD', locale = 'en-US') => {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

  if (numericAmount === null || numericAmount === undefined || isNaN(numericAmount)) {
    return '---';
  }

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: numericAmount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(numericAmount);
};

/**
 * Formats high-valuation assets into compact notation (e.g., $1.2M, $500K).
 * @param {number|string} amount 
 * @param {string} [currency='USD']
 * @param {string} [locale='en-US']
 */
export const formatCompactNumber = (amount, currency = 'USD', locale = 'en-US') => {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

  if (numericAmount === null || numericAmount === undefined || isNaN(numericAmount)) {
    return '---';
  }

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 1,
  }).format(numericAmount);
};

/**
 * Specifically for cryptocurrency or high-precision assets.
 * @param {number|string} amount 
 * @param {string} [symbol='BTC']
 */
export const formatCrypto = (amount, symbol = 'BTC') => {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (numericAmount === null || numericAmount === undefined || isNaN(numericAmount)) {
    return `0.00000000 ${symbol}`;
  }

  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 8,
    maximumFractionDigits: 8,
  }).format(numericAmount) + ` ${symbol}`;
};

/**
 * Formats a plain number with thousand separators without currency symbols.
 * @param {number|string} amount 
 */
export const formatNumber = (amount, locale = 'en-US') => {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(numericAmount)) return '0';

  return new Intl.NumberFormat(locale).format(numericAmount);
};
