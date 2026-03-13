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
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  bufferMaxEntries: 0,
  bufferCommands: false,
  family: 4,
  autoIndex: process.env.NODE_ENV !== 'production',
};

/**
 * Colorful console logger for connection status
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
 * Handle mongoose connection events for real-time monitoring
 */
const handleConnectionEvents = () => {
  mongoose.connection.on('connected', () => {
    connectionState.isConnected = true;
    connectionState.retryCount = 0;
    log('MongoDB: Cloud connection established successfully.', 'success');
  });

  mongoose.connection.on('error', (err) => {
    connectionState.isConnected = false;
    log(`MongoDB: Critical connection error: ${err.message}`, 'error');
  });

  mongoose.connection.on('disconnected', () => {
    connectionState.isConnected = false;
    log('MongoDB: Connection lost. Attempting to restore...', 'warning');
  });

  process.on('SIGINT', async () => {
    await mongoose.connection.close();
    log('MongoDB: Connection closed due to application termination.', 'info');
    process.exit(0);
  });
};

/**
 * Main function to establish and manage database connection
 */
export const connectDB = async () => {
  if (connectionState.isConnected) return;

  handleConnectionEvents();

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, mongooseOptions);
    return conn;
  } catch (error) {
    connectionState.retryCount += 1;
    log(`MongoDB: Failed to connect (Attempt ${connectionState.retryCount}/${connectionState.maxRetries})`, 'error');

    if (connectionState.retryCount < connectionState.maxRetries) {
      log('MongoDB: Retrying in 5 seconds...', 'reconnect');
      setTimeout(connectDB, 5000);
    } else {
      log('MongoDB: Max retries reached. System shutdown recommended.', 'error');
      process.exit(1);
    }
  }
};
