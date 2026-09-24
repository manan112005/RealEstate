const express = require('express');
const router = express.Router();
const {
  getStates, getCitiesByState, getAreasByCity,
  createState, updateState, deleteState,
  createCity, updateCity, deleteCity,
  createArea, updateArea, deleteArea
} = require('../controllers/locationController');
const { protect, admin } = require('../middlewares/authMiddleware');

// Public routes
router.get('/states', getStates);
router.get('/cities/:stateId', getCitiesByState);
router.get('/areas/:cityId', getAreasByCity);

// Admin - States
router.post('/admin/states', protect, admin, createState);
router.put('/admin/states/:id', protect, admin, updateState);
router.delete('/admin/states/:id', protect, admin, deleteState);

// Admin - Cities
router.post('/admin/cities', protect, admin, createCity);
router.put('/admin/cities/:id', protect, admin, updateCity);
router.delete('/admin/cities/:id', protect, admin, deleteCity);

// Admin - Areas
router.post('/admin/areas', protect, admin, createArea);
router.put('/admin/areas/:id', protect, admin, updateArea);
router.delete('/admin/areas/:id', protect, admin, deleteArea);

module.exports = router;
