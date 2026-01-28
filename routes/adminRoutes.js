const express = require('express');
const router = express.Router();
const { register, login, verify } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/verify', protect, verify);

module.exports = router;
