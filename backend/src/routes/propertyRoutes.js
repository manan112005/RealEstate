const express = require('express');
const router = express.Router();
const { 
  createProperty, updateProperty, deleteProperty, 
  getProperties, getLatestProperties, getPropertyById, getAdminProperties,
  getCategories, getTypes
} = require('../controllers/propertyController');
const { protect } = require('../middlewares/authMiddleware');
const { upload } = require('../middlewares/upload');
const { body } = require('express-validator');
const { validateRequest } = require('../middlewares/validator');

// Public routes
router.get('/categories', getCategories);
router.get('/types/:categoryId', getTypes);
router.get('/properties/latest', getLatestProperties);
router.get('/properties', getProperties);
router.get('/properties/:id', getPropertyById);

// Admin protected routes
router.get('/admin/properties', protect, getAdminProperties);
router.post('/admin/properties', protect, upload.array('images', 10), [
  body('title').notEmpty().withMessage('Title is required'),
  body('price').isNumeric().withMessage('Price must be a valid number'),
  body('listing_type').notEmpty().withMessage('Listing type is required')
], validateRequest, createProperty);
router.put('/admin/properties/:id', protect, upload.array('images', 10), updateProperty);
router.delete('/admin/properties/:id', protect, deleteProperty);

module.exports = router;
