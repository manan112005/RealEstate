const express = require('express');
const router = express.Router();
const { signup, login, getMe } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const { authLimiter } = require('../middlewares/rateLimiter');
const { body } = require('express-validator');
const { validateRequest } = require('../middlewares/validator');

router.post('/signup', authLimiter, [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], validateRequest, signup);

router.post('/login', authLimiter, [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
], validateRequest, login);

router.get('/me', protect, getMe);

module.exports = router;
