const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

// Load env vars
dotenv.config();

// Connect to database
const connectDB = require('./config/database');
connectDB();

// Route files
const products = require('./routes/productRoutes.js');
const products = require('./routes/productRoutes');
const orders = require('./routes/orderRoutes');
const payments = require('./routes/paymentRoutes');
const admin = require('./routes/adminRoutes');
const ai = require('./routes/aiRoutes');

// Middleware
const errorHandler = require('./middleware/errorMiddleware');

const app = express();

// Body parser
app.use(express.json({ limit: '10mb' }));

// Sanitize data
app.use(mongoSanitize());

// Prevent XSS attacks
app.use(xss());

// Prevent http param pollution
app.use(hpp());

// Set security headers
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100,
});
app.use(limiter);

// Enable CORS
app.use(cors());

// Mount routers
app.use('/api/auth', auth);
app.use('/api/products', products);
app.use('/api/orders', orders);
app.use('/api/payments', payments);
app.use('/api/admin', admin);
app.use('/api/ai', ai);

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => {
    process.exit(1);
  });
});
