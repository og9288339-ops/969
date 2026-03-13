/**
 * @module authController
 * @description Zero-Trust ES2024 enterprise auth controller ($10k+ Valuation)
 * @author Lead Security Engineer
 * @version 8.0.0 (Pure ES2024)
 * @since 2024
 */

import { catchAsync } from '../utils/catchAsync.js';
import * as authService from './authService.js';
import AppError from '../utils/appError.js';
import AuditLog from '../models/AuditLog.js';

/**
 * @description Register a new user with secure token generation
 */
export const register = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(new AppError('Missing required fields', 400));
  }

  const { user, accessToken, refreshToken } = await authService.registerUser({ 
    name, 
    email, 
    password 
  });

  sendRefreshToken(res, refreshToken);

  res.status(201).json({
    status: 'success',
    accessToken,
    data: { user }
  });
});

/**
 * @description Login with device and IP tracking for Audit Logs
 */
export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  const { user, accessToken, refreshToken } = await authService.loginUser(email, password);

  await AuditLog.create({
    userId: user._id,
    action: 'LOGIN_SUCCESS',
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  sendRefreshToken(res, refreshToken);

  res.status(200).json({
    status: 'success',
    accessToken,
    data: { user }
  });
});

/**
 * @description Logout and invalidate session server-side
 */
export const logout = catchAsync(async (req, res, next) => {
  const { refreshToken } = req.cookies;

  if (refreshToken) {
    await authService.revokeToken(refreshToken);
  }

  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict'
  });

  res.status(204).json({ status: 'success' });
});

/**
 * @private
 * @description Secure Cookie Handler for Refresh Tokens
 */
const sendRefreshToken = (res, token) => {
  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict'
  };
  res.cookie('refreshToken', token, cookieOptions);
};
