const express = require('express');
const router = express.Router();
const { submitContact, getContacts } = require('../controllers/contactController');
const { protect } = require('../middlewares/authMiddleware');
const { body } = require('express-validator');
const { validateRequest } = require('../middlewares/validator');

router.post('/contact', [
  body('name').notEmpty().withMessage('Name is required'),
  body('phone').notEmpty().withMessage('Phone number is required'),
  body('email').optional({ checkFalsy: true }).isEmail().withMessage('Valid email is required')
], validateRequest, submitContact);

router.get('/admin/messages', protect, getContacts);

module.exports = router;
