const express = require('express');
const { pricingSuggestion, productOptimization, recommendations } = require('../controllers/aiController');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

router.post('/pricing', authenticate, pricingSuggestion);
router.post('/optimize', authenticate, productOptimization);
router.post('/recommendations', authenticate, recommendations);

module.exports = router;
