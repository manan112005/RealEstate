const { Partner } = require('../models');
const { cloudinary } = require('../middlewares/upload');

// Get all partners (Public & Admin)
const getPartners = async (req, res) => {
  try {
    const partners = await Partner.findAll({
      order: [['display_order', 'ASC'], ['id', 'ASC']]
    });
    res.json({ success: true, data: partners });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create a partner (Admin)
const createPartner = async (req, res) => {
  try {
    const { name, display_order } = req.body;
    let logo_url = null;
    let logo_public_id = null;

    if (req.file) {
      logo_url = req.file.path;
      logo_public_id = req.file.filename;
    }

    const partner = await Partner.create({
      name, 
      display_order: display_order || 0,
      logo_cloudinary_url: logo_url,
      logo_public_id
    });

    res.status(201).json({ success: true, data: partner, message: 'Partner created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a partner (Admin)
const updatePartner = async (req, res) => {
  try {
    const partner = await Partner.findByPk(req.params.id);
    if (!partner) return res.status(404).json({ success: false, message: 'Partner not found' });

    const { name, display_order } = req.body;
    let updates = { name, display_order };

    if (req.file) {
      // Delete old logo from Cloudinary if exists
      if (partner.logo_public_id) {
        await cloudinary.uploader.destroy(partner.logo_public_id);
      }
      updates.logo_cloudinary_url = req.file.path;
      updates.logo_public_id = req.file.filename;
    }

    await partner.update(updates);
    res.json({ success: true, data: partner, message: 'Partner updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a partner (Admin)
const deletePartner = async (req, res) => {
  try {
    const partner = await Partner.findByPk(req.params.id);
    if (!partner) return res.status(404).json({ success: false, message: 'Partner not found' });

    if (partner.logo_public_id) {
      await cloudinary.uploader.destroy(partner.logo_public_id);
    }

    await partner.destroy();
    res.json({ success: true, message: 'Partner deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getPartners,
  createPartner,
  updatePartner,
  deletePartner
};
