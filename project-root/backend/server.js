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
const auth = require('./routes/authRoutes'); 
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
app.use(xss());
app.use(hpp());
app.use(helmet());

// Enable CORS
app.use(cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, 
  max: 100,
});
app.use(limiter);

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

process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});
