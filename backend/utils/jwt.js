/**
 * @module jwt
 * @description Enterprise-grade Dual-Token Authentication Engine ($10k+ Architecture)
 * @author Senior Security Architect
 * @version 3.0.0
 * @since 2026
 */

import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

/**
 * @description Generates a short-lived Access Token for active session requests
 * @param {string} userId - The MongoDB User ID
 * @param {Array} roles - User permission roles (e.g., ['user', 'admin'])
 */
export const generateAccessToken = (userId, roles = ['user']) => {
  return jwt.sign(
    { 
      id: userId, 
      roles,
      type: 'access'
    },
    process.env.JWT_SECRET,
    { 
      expiresIn: process.env.JWT_ACCESS_EXPIRATION || '15m',
      algorithm: 'HS256'
    }
  );
};

/**
 * @description Generates a long-lived Refresh Token for session persistence and rotating access
 * @param {string} userId - The MongoDB User ID
 */
export const generateRefreshToken = (userId) => {
  return jwt.sign(
    { 
      id: userId,
      type: 'refresh'
    },
    process.env.JWT_REFRESH_SECRET,
    { 
      expiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d',
      algorithm: 'HS256'
    }
  );
};

/**
 * @description Cryptographically verifies the integrity and expiration of a JWT
 * @param {string} token - The JWT string
 * @param {boolean} isRefresh - Flag to determine which secret to use
 */
export const verifyToken = (token, isRefresh = false) => {
  try {
    const secret = isRefresh ? process.env.JWT_REFRESH_SECRET : process.env.JWT_SECRET;
    return jwt.verify(token, secret);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      const expiredErr = new Error('JWT_EXPIRED');
      expiredErr.statusCode = 401;
      throw expiredErr;
    }
    const invalidErr = new Error('JWT_INVALID');
    invalidErr.statusCode = 403;
    throw invalidErr;
  }
};

/**
 * @description Extracts payload data without verification (for client-side UI hints)
 */
export const decodeToken = (token) => {
  return jwt.decode(token);
};

/**
 * @description Validates if the token type matches the expected usage (access vs refresh)
 */
export const validateTokenType = (decoded, expectedType) => {
  return decoded && decoded.type === expectedType;
};

export default {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  decodeToken,
  validateTokenType
};
