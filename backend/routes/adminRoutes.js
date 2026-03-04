const express = require('express');
const { getUsers, getProducts, getOrders, analytics } = require('../controllers/adminController');
const { authenticate, authorizeAdmin } = require('../middleware/auth');
const router = express.Router();

router.get('/users', authenticate, authorizeAdmin, getUsers);
router.get('/products', authenticate, authorizeAdmin, getProducts);
router.get('/orders', authenticate, authorizeAdmin, getOrders);
router.get('/analytics', authenticate, authorizeAdmin, analytics);

module.exports = router;