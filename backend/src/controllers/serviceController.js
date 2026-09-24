const { Service } = require('../models');
const { cloudinary } = require('../middlewares/upload');

// Get all services
const getServices = async (req, res) => {
  try {
    const services = await Service.findAll();
    res.json({ success: true, data: services });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create a service
const createService = async (req, res) => {
  try {
    const { title, description, slug } = req.body;
    let image_url = null;
    let image_public_id = null;

    if (req.file) {
      image_url = req.file.path;
      image_public_id = req.file.filename;
    }

    const service = await Service.create({
      title, description, slug, image_url, image_public_id
    });

    res.status(201).json({ success: true, data: service, message: 'Service created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a service
const updateService = async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });

    const { title, description, slug } = req.body;
    let updates = { title, description, slug };

    if (req.file) {
      if (service.image_public_id) {
        await cloudinary.uploader.destroy(service.image_public_id);
      }
      updates.image_url = req.file.path;
      updates.image_public_id = req.file.filename;
    }

    await service.update(updates);
    res.json({ success: true, data: service, message: 'Service updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a service
const deleteService = async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });

    if (service.image_public_id) {
      await cloudinary.uploader.destroy(service.image_public_id);
    }

    await service.destroy();
    res.json({ success: true, message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getServices,
  createService,
  updateService,
  deleteService
};
