const express = require('express');
const { getProducts, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

router.get('/', getProducts);
router.post('/', authenticate, createProduct);
router.put('/:id', authenticate, updateProduct);
router.delete('/:id', authenticate, deleteProduct);

module.exports = router;
