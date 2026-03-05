const express = require('express');
const { register, login } = require('../controllers/authController');
const router = express.Router();

router.get('/test', (req, res) => {
    res.status(200).json({ 
        message: "Backend is connected successfully!",
        status: "Running on Vercel"
    });
});

router.post('/register', register);
router.post('/login', login);

module.exports = router;
