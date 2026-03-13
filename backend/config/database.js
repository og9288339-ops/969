/**
 * @module database
 * @description Production-grade MongoDB connection module for luxury MERN e-commerce
 * @author Senior Backend Architect
 * @version 3.1.0
 * @since 2024
 */

import mongoose from 'mongoose';
import colors from 'colors';

/**
 * @typedef {Object} ConnectionState
 * @property {boolean} isConnected - Current connection status
 * @property {number} retryCount - Retry attempts count
 */

/**
 * Global connection state
 */
const connectionState = {
  isConnected: false,
  retryCount: 0,
  maxRetries: 5,
};

/**
 * MongoDB connection options optimized for production
 */
const mongooseOptions = {
  maxPoolSize: 10,                    // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000,     // Keep trying to send operations for 5s
  socketTimeoutMS: 45000,             // Close sockets after 45s of inactivity
  bufferMaxEntries: 0,                // Disable mongoose buffering
  bufferCommands: false,              // Disable buffering commands
  family: 4,                          // Use IPv4, skip trying IPv6
  autoIndex: process.env.NODE_ENV !== 'production', // Don't build indexes in prod
};

/**
 * Colorful console logger for connection status
 * @param {string} message - Log message
 * @param {string} [type='info'] - Log type (success, error, warning)
 */
const log = (message, type = 'info') => {
  const timestamp = new Date().toISOString();
  
  const colorsMap = {
    success: 'green',
    error: 'red',
    warning: 'yellow',
    info: 'cyan',
    reconnect: 'magenta'
  };

  const color = colorsMap[type] || 'white';
  console.log(`${colors[color](`[${timestamp}]`)} ${colors.bold(message)}`);
};

/**
 * Handle mongoose connection events
 * @param {mongoose.Connection} conn - Mongoose connection instance
 */
const handleConnectionEvents
