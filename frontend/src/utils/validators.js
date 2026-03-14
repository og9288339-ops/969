/**
 * @module validators
 * @description Enterprise-grade validation suite ($10k+ luxury marketplace)
 * @author Senior Cyber-Security Engineer & Frontend Architect
 * @version 2.0.0
 */

/**
 * Security-focused password validation
 * Rules: Min 8 chars, 1 Upper, 1 Lower, 1 Number, 1 Special Char
 */
export const validatePassword = (password) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const isValid = regex.test(password);
  return {
    isValid,
    message: isValid ? "" : "Security protocol requires 8+ chars with uppercase, number, and special character.",
  };
};

/**
 * Standard-compliant email validation
 */
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValid = regex.test(email);
  return {
    isValid,
    message: isValid ? "" : "Please enter a valid professional email address.",
  };
};

/**
 * High-valuation asset price validation
 */
export const validatePrice = (price) => {
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
  const isValid = !isNaN(numericPrice) && numericPrice > 0;
  return {
    isValid,
    message: isValid ? "" : "Asset valuation must be a positive numeric value.",
  };
};

/**
 * Input Sanitization to prevent XSS (Cross-Site Scripting)
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input
    .replace(/<[^>]*>?/gm, '')
    .replace(/[<>]/g, '')
    .trim();
};

/**
 * International Phone Format Validation
 */
export const validatePhone = (phone) => {
  const regex = /^\+?[1-9]\d{1,14}$/;
  const isValid = regex.test(phone);
  return {
    isValid,
    message: isValid ? "" : "Please enter a valid international phone number.",
  };
};

/**
 * URL/Certificate Link Validation
 */
export const validateURL = (url) => {
  try {
    new URL(url);
    return { isValid: true, message: "" };
  } catch (_) {
    return { isValid: false, message: "Invalid URL or certificate link." };
  }
};

/**
 * Comprehensive Form Validator Wrapper
 */
export const validateForm = (data, schema) => {
  const errors = {};
  let isFormValid = true;

  Object.keys(schema).forEach((field) => {
    const value = data[field];
    const validator = schema[field];
    
    if (typeof validator === 'function') {
      const result = validator(value);
      if (!result.isValid) {
        errors[field] = result.message;
        isFormValid = false;
      }
    }
  });

  return { isFormValid, errors };
};
