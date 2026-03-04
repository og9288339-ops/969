const express = require('express');
const { getOrders, createOrder, updateOrderStatus } = require('../controllers/orderController');
const { authenticate, authorizeAdmin } = require('../middleware/auth');
const router = express.Router();

router.get('/', authenticate, getOrders);
router.post('/', authenticate, createOrder);
router.put('/:id', authenticate, authorizeAdmin, updateOrderStatus);

module.exports = router;