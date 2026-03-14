/**
 * @module server
 * @description Apex production server ($10k+ MERN enterprise marketplace)
 * @author Principal Backend Architect
 * @version 3.0.0
 * @since 2026
 */

import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import path from 'path';

// Load Core Services & Config
dotenv.config();

const app = express();

/**
 * @section Security Implementation
 */
app.use(helmet()); 
app.use(hpp()); 
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: 'Too many requests from this IP, please try again after 15 minutes'
  }
});
app.use('/api/', limiter);

/**
 * @section Middlewares & Parsers
 */
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Critical: Stripe Webhooks Raw Body Parser
app.use('/api/v1/webhooks', express.raw({ type: 'application/json' }));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

/**
 * @section API Route Orchestration
 */
// Placeholder for route imports
// import authRoutes from './routes/auth.js';
// import productRoutes from './routes/products.js';
// import orderRoutes from './routes/orders.js';
// import paymentRoutes from './routes/payments.js';

app.use('/api/v1/health', (req, res) => res.status(200).json({ status: 'UP', timestamp: new Date() }));

/**
 * @section Global Error Handling (Enterprise Grade)
 */
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🛡️' : err.stack,
  });
});

/**
 * @section Execution & Lifecycle Management
 */
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`
  🚀 Server Initialized
  -----------------------------------
  Environment: ${process.env.NODE_ENV}
  Port:        ${PORT}
  Time:        ${new Date().toISOString()}
  -----------------------------------
  `);
});

// Handle Unhandled Rejections (e.g., MongoDB Connection Failure)
process.on('unhandledRejection', (err) => {
  console.error(`🔴 Unhandled Rejection: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Handle Uncaught Exceptions
process.on('uncaughtException', (err) => {
  console.error(`🔴 Uncaught Exception: ${err.message}`);
  process.exit(1);
});

export default app;
