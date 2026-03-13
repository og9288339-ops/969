/**
 * @module adminMiddleware
 * @description Zero-Trust enterprise security middleware ($10k+ marketplace)
 * @author Principal Security Architect
 * @version 6.0.0
 * @since 2024
 */

import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import AppError from '../utils/appError.js';
import { catchAsync } from '../utils/catchAsync.js';

/**
 * @description Protect middleware: Verifies JWT, check user status & password history
 */
export const protect = catchAsync(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(new AppError('You are not logged in! Please log in to get access.', 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError('The user belonging to this token no longer exists.', 401));
  }

  if (currentUser.changedPasswordAfter && currentUser.changedPasswordAfter(decoded.iat)) {
    return next(new AppError('User recently changed password! Please log in again.', 401));
  }

  if (currentUser.isSuspended) {
    return next(new AppError('Your account has been suspended. Contact support.', 403));
  }

  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

/**
 * @description Admin-only middleware for high-privilege routes
 */
export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return next(new AppError('Access Denied: Admin privileges required', 403));
  }
};

/**
 * @description Granular Access Control for multi-role environments
 * @param {...string} roles - Allowed roles (e.g., 'admin', 'editor', 'manager')
 */
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }
    next();
  };
};

/**
 * @description Verify if the account is verified (Email/Phone)
 */
export const isVerified = (req, res, next) => {
  if (!req.user.isVerified) {
    return next(new AppError('Please verify your account to access this feature.', 403));
  }
  next();
};
