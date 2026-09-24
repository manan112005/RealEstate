const express = require('express');
const router = express.Router();
const { getPartners, createPartner, updatePartner, deletePartner } = require('../controllers/partnerController');
const { protect } = require('../middlewares/authMiddleware');
const { upload } = require('../middlewares/upload');

// Public route
router.get('/partners', getPartners);

// Admin routes
router.post('/admin/partners', protect, upload.single('logo'), createPartner);
router.put('/admin/partners/:id', protect, upload.single('logo'), updatePartner);
router.delete('/admin/partners/:id', protect, deletePartner);

module.exports = router;
