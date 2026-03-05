const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
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

app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use('/api/auth', auth);
app.use('/api/products', products);
app.use('/api/orders', orders);
app.use('/api/payments', payments);
app.use('/api/admin', admin);
app.use('/api/ai', ai);

app.use(errorHandler);

// Vercel Serverless Export
module.exports = app;

// Local testing only
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
