const { State, City, Area } = require('../models');

// --- Public Endpoints ---

// @desc    Get all states
// @route   GET /api/states
const getStates = async (req, res) => {
  try {
    const states = await State.findAll({ order: [['name', 'ASC']] });
    res.json({ success: true, data: states });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get cities for a state
// @route   GET /api/cities/:stateId
const getCitiesByState = async (req, res) => {
  try {
    const { stateId } = req.params;
    const cities = await City.findAll({ 
      where: { state_id: stateId },
      order: [['name', 'ASC']] 
    });
    res.json({ success: true, data: cities });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get areas for a city
// @route   GET /api/areas/:cityId
const getAreasByCity = async (req, res) => {
  try {
    const { cityId } = req.params;
    const areas = await Area.findAll({ 
      where: { city_id: cityId },
      order: [['name', 'ASC']] 
    });
    res.json({ success: true, data: areas });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// --- Admin Endpoints ---

// @desc    Create a state
// @route   POST /api/admin/states
const createState = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Name is required' });
    const state = await State.create({ name });
    res.status(201).json(state);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a state
// @route   PUT /api/admin/states/:id
const updateState = async (req, res) => {
  try {
    const { name } = req.body;
    const state = await State.findByPk(req.params.id);
    if (!state) return res.status(404).json({ message: 'State not found' });
    state.name = name || state.name;
    await state.save();
    res.json(state);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a state
// @route   DELETE /api/admin/states/:id
const deleteState = async (req, res) => {
  try {
    const state = await State.findByPk(req.params.id);
    if (!state) return res.status(404).json({ message: 'State not found' });
    await state.destroy();
    res.json({ message: 'State removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a city
// @route   POST /api/admin/cities
const createCity = async (req, res) => {
  try {
    const { name, state_id } = req.body;
    if (!name || !state_id) return res.status(400).json({ message: 'Name and state_id are required' });
    const city = await City.create({ name, state_id });
    res.status(201).json(city);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a city
// @route   PUT /api/admin/cities/:id
const updateCity = async (req, res) => {
  try {
    const { name, state_id } = req.body;
    const city = await City.findByPk(req.params.id);
    if (!city) return res.status(404).json({ message: 'City not found' });
    city.name = name || city.name;
    city.state_id = state_id || city.state_id;
    await city.save();
    res.json(city);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a city
// @route   DELETE /api/admin/cities/:id
const deleteCity = async (req, res) => {
  try {
    const city = await City.findByPk(req.params.id);
    if (!city) return res.status(404).json({ message: 'City not found' });
    await city.destroy();
    res.json({ message: 'City removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create an area
// @route   POST /api/admin/areas
const createArea = async (req, res) => {
  try {
    const { name, city_id } = req.body;
    if (!name || !city_id) return res.status(400).json({ message: 'Name and city_id are required' });
    const area = await Area.create({ name, city_id });
    res.status(201).json(area);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update an area
// @route   PUT /api/admin/areas/:id
const updateArea = async (req, res) => {
  try {
    const { name, city_id } = req.body;
    const area = await Area.findByPk(req.params.id);
    if (!area) return res.status(404).json({ message: 'Area not found' });
    area.name = name || area.name;
    area.city_id = city_id || area.city_id;
    await area.save();
    res.json(area);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete an area
// @route   DELETE /api/admin/areas/:id
const deleteArea = async (req, res) => {
  try {
    const area = await Area.findByPk(req.params.id);
    if (!area) return res.status(404).json({ message: 'Area not found' });
    await area.destroy();
    res.json({ message: 'Area removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getStates, getCitiesByState, getAreasByCity,
  createState, updateState, deleteState,
  createCity, updateCity, deleteCity,
  createArea, updateArea, deleteArea
};
