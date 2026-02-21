const express = require('express');
const { stripePayment, paypalPayment, coinbasePayment } = require('../controllers/paymentController');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

router.post('/stripe', authenticate, stripePayment);
router.post('/paypal', authenticate, paypalPayment);
router.post('/coinbase', authenticate, coinbasePayment);

module.exports = router;
