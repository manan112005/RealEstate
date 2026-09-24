const express = require('express');
const router = express.Router();
const { getServices, createService, updateService, deleteService } = require('../controllers/serviceController');
const { protect } = require('../middlewares/authMiddleware');
const { upload } = require('../middlewares/upload');

// Public route
router.get('/services', getServices);

// Admin routes
router.post('/admin/services', protect, upload.single('image'), createService);
router.put('/admin/services/:id', protect, upload.single('image'), updateService);
router.delete('/admin/services/:id', protect, deleteService);

module.exports = router;
