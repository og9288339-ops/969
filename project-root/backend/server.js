const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

dotenv.config();

const connectDB = require('./config/database');
connectDB();

const auth = require('./routes/authRoutes'); 
const products = require('./routes/productRoutes'); 
const orders = require('./routes/orderRoutes');
const payments = require('./routes/paymentRoutes');
const admin = require('./routes/adminRoutes');
const ai = require('./routes/aiRoutes');

const errorHandler = require('./middleware/errorMiddleware');

const app = express();

app.use(express.json({ limit: '10mb' }));

app.use(mongoSanitize());
app.use(xss());
app.use(hpp());
app.use(helmet());

app.use(cors());

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, 
  max: 100,
});
app.use(limiter);

app.use('/api/auth', auth);
app.use('/api/products', products);
app.use('/api/orders', orders);
app.use('/api/payments', payments);
app.use('/api/admin', admin);
app.use('/api/ai', ai);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});
