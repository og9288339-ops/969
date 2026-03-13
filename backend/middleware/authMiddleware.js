/**
 * @module authMiddleware
 * @description Master-class Zero-Trust auth middleware ($10k+ marketplace)
 * @author Principal Security Engineer
 * @version 7.2.0
 * @since 2024
 */

import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import RevokedToken from '../models/RevokedToken.js';
import AppError from '../utils/appError.js';
import { catchAsync } from '../utils/catchAsync.js';

/**
 * @description Master Protection: Verifies JWT, Revocation Status, and User Integrity
 */
export const protect = catchAsync(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(new AppError('Authentication failed: No token provided.', 401));
  }

  // 1. Blacklist Check (Security Grade: High)
  const isRevoked = await RevokedToken.findOne({ token }).lean();
  if (isRevoked) {
    return next(new AppError('This session has been revoked. Please log in again.', 401));
  }

  // 2. JWT Verification
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // 3. Persistent User Verification
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError('The security token is valid, but the user no longer exists.', 401));
  }

  // 4. Password Expiration & Integrity Logic
  if (currentUser.changedPasswordAfter && currentUser.changedPasswordAfter(decoded.iat)) {
    return next(new AppError('Security breach: Password changed recently. Re-authentication required.', 401));
  }

  // 5. Account Status Guard
  if (currentUser.isSuspended) {
    return next(new AppError('Access denied: This account is currently suspended.', 403));
  }

  // Grant Access
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

/**
 * @description Helper: Generates a Secure JWT with Enterprise Claims
 */
export const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
    issuer: 'Elite-Marketplace-API',
    audience: 'Elite-Marketplace-Client'
  });
};

/**
 * @description Optional: Simple check for UI/Frontend state
 */
export const isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      const decoded = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) return next();
      if (currentUser.changedPasswordAfter && currentUser.changedPasswordAfter(decoded.iat)) return next();
      
      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};
