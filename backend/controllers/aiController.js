/**
 * @module adminController
 * @description Elite enterprise admin controller for $10k+ MERN marketplace
 * @author Principal Backend Architect
 * @version 5.0.0
 * @since 2024
 * @typedef {import('mongoose').Types.ObjectId} ObjectId
 */

import mongoose from 'mongoose';
import { User, Order, Product, Inventory, AuditLog } from '../models/index.js';

/**
 * @class AppError
 * @description Custom enterprise error class with severity levels
 */
class AppError extends Error {
  constructor(message, severity = 'ERROR', code = 'INTERNAL_ERROR', details = {}) {
    super(message
