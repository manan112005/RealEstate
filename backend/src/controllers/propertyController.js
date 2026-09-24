const { Op } = require('sequelize');
const { Property, PropertyImage, State, City, Area, PropertyType, PropertyCategory } = require('../models');
const { cloudinary } = require('../middlewares/upload');

// Create Property
const createProperty = async (req, res) => {
  try {
    const { 
      title, description, property_type_id, state_id, city_id, area_id, bhk, sq_feet, sq_yard, price, listing_type,
      bathrooms, balconies, area_type, maintenance_charge, floor_number, total_floors, age_of_property, 
      covered_parking, open_parking, furnishing_status, construction_status, brokerage_charge,
      address_line_1, flat_no, property_label, garage, transaction_type, available_from, charge_brokerage, partner_id, status
    } = req.body;
    
    const property = await Property.create({
      title, 
      description, 
      property_type_id: property_type_id || null, 
      state_id: state_id || null, 
      city_id: city_id || null, 
      area_id: area_id || null, 
      partner_id: partner_id || null,
      bhk: bhk ? parseInt(bhk) : null, 
      sq_feet: sq_feet ? parseFloat(sq_feet) : null, 
      sq_yard: sq_yard ? parseFloat(sq_yard) : null, 
      price: price ? parseFloat(price) : 0, 
      listing_type: listing_type || 'sale',
      bathrooms: bathrooms ? parseInt(bathrooms) : null,
      balconies: balconies ? parseInt(balconies) : null,
      area_type: area_type || null,
      maintenance_charge: maintenance_charge ? parseFloat(maintenance_charge) : null,
      floor_number: floor_number || null,
      total_floors: total_floors || null,
      age_of_property: age_of_property || null,
      covered_parking: covered_parking ? parseInt(covered_parking) : null,
      open_parking: open_parking ? parseInt(open_parking) : null,
      furnishing_status: furnishing_status || null,
      construction_status: construction_status || null,
      brokerage_charge: brokerage_charge ? parseFloat(brokerage_charge) : null,
      address_line_1: address_line_1 || null,
      flat_no: flat_no || null,
      property_label: property_label || null,
      garage: garage || null,
      transaction_type: transaction_type || null,
      available_from: available_from || null,
      charge_brokerage: charge_brokerage === 'true' || charge_brokerage === true,
      status: status || 'active',
      created_by: req.user ? req.user.id : null
    });

    if (req.files && req.files.length > 0) {
      const imageRecords = req.files.map((file, index) => ({
        property_id: property.id,
        cloudinary_url: file.path,
        cloudinary_public_id: file.filename,
        is_primary: index === 0
      }));
      await PropertyImage.bulkCreate(imageRecords);
    }

    res.status(201).json({ success: true, property });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Property
const updateProperty = async (req, res) => {
  try {
    const property = await Property.findByPk(req.params.id);
    if (!property) return res.status(404).json({ success: false, message: 'Property not found' });

    const updateData = { ...req.body };
    if (updateData.charge_brokerage !== undefined) {
      updateData.charge_brokerage = updateData.charge_brokerage === 'true' || updateData.charge_brokerage === true;
    }
    ['bhk', 'bathrooms', 'balconies', 'covered_parking', 'open_parking', 'property_type_id', 'state_id', 'city_id', 'area_id', 'partner_id'].forEach(f => {
      if (updateData[f] === '') updateData[f] = null;
      else if (updateData[f] !== undefined && updateData[f] !== null) updateData[f] = parseInt(updateData[f]) || null;
    });
    ['price', 'sq_feet', 'sq_yard', 'maintenance_charge', 'brokerage_charge'].forEach(f => {
      if (updateData[f] === '') updateData[f] = null;
      else if (updateData[f] !== undefined && updateData[f] !== null) updateData[f] = parseFloat(updateData[f]) || null;
    });
    if (updateData.available_from === '') updateData.available_from = null;

    // Update basic fields
    await property.update(updateData);

    // Remove images if specified
    if (req.body.removedImages) {
      let removed = req.body.removedImages;
      if (typeof removed === 'string') {
        try { removed = JSON.parse(removed); } catch(e) { removed = [removed]; }
      }
      
      if (Array.isArray(removed) && removed.length > 0) {
        for (const public_id of removed) {
          await cloudinary.uploader.destroy(public_id);
          await PropertyImage.destroy({ where: { cloudinary_public_id: public_id, property_id: property.id } });
        }
      }
    }

    // Add new images
    if (req.files && req.files.length > 0) {
      const existingImages = await PropertyImage.count({ where: { property_id: property.id } });
      const imageRecords = req.files.map((file, index) => ({
        property_id: property.id,
        cloudinary_url: file.path,
        cloudinary_public_id: file.filename,
        is_primary: existingImages === 0 && index === 0
      }));
      await PropertyImage.bulkCreate(imageRecords);
    }

    res.json({ success: true, message: 'Property updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Property
const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findByPk(req.params.id, {
      include: [PropertyImage]
    });
    if (!property) return res.status(404).json({ success: false, message: 'Property not found' });

    // Delete images from cloudinary
    if (property.PropertyImages && property.PropertyImages.length > 0) {
      for (const img of property.PropertyImages) {
        await cloudinary.uploader.destroy(img.cloudinary_public_id);
      }
    }

    await property.destroy();
    res.json({ success: true, message: 'Property deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Public Properties (Paginated + Filtered)
const getProperties = async (req, res) => {
  try {
    const { 
      page = 1, limit = 10, property_type_id, state_id, city_id, area_id, 
      bhk, minPrice, maxPrice, listing_type, search, sort 
    } = req.query;

    const where = {};
    if (property_type_id && property_type_id !== 'null' && property_type_id !== 'undefined' && !isNaN(property_type_id)) {
      where.property_type_id = parseInt(property_type_id);
    }
    if (state_id && state_id !== 'null' && state_id !== 'undefined' && !isNaN(state_id)) {
      where.state_id = parseInt(state_id);
    }
    if (city_id && city_id !== 'null' && city_id !== 'undefined' && !isNaN(city_id)) {
      where.city_id = parseInt(city_id);
    }
    if (area_id && area_id !== 'null' && area_id !== 'undefined' && !isNaN(area_id)) {
      where.area_id = parseInt(area_id);
    }
    if (bhk && bhk !== 'null' && bhk !== 'undefined' && !isNaN(bhk)) {
      where.bhk = parseInt(bhk);
    }
    if (listing_type && listing_type !== 'null' && listing_type !== 'undefined' && listing_type.trim() !== '') {
      where.listing_type = listing_type;
    }
    
    if ((minPrice && !isNaN(minPrice)) || (maxPrice && !isNaN(maxPrice))) {
      where.price = {};
      if (minPrice && !isNaN(minPrice)) where.price[Op.gte] = parseFloat(minPrice);
      if (maxPrice && !isNaN(maxPrice)) where.price[Op.lte] = parseFloat(maxPrice);
    }

    const include = [
      { model: PropertyImage },
      { model: State, attributes: ['id', 'name'] },
      { model: City, attributes: ['id', 'name'] },
      { model: Area, attributes: ['id', 'name'] },
      { model: PropertyType, attributes: ['id', 'name'] }
    ];

    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { '$Area.name$': { [Op.iLike]: `%${search}%` } }
      ];
    }

    const offset = (page - 1) * limit;

    let order = [['created_at', 'DESC']];
    if (sort === 'price_asc') {
      order = [['price', 'ASC'], ['created_at', 'DESC']];
    } else if (sort === 'price_desc') {
      order = [['price', 'DESC'], ['created_at', 'DESC']];
    } else if (sort === 'oldest') {
      order = [['created_at', 'ASC']];
    }

    const properties = await Property.findAndCountAll({
      distinct: true,
      where,
      include,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order
    });

    res.json({
      success: true,
      data: properties.rows,
      total: properties.count,
      page: parseInt(page),
      totalPages: Math.ceil(properties.count / limit)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Latest Properties (For Homepage)
const getLatestProperties = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;
    const properties = await Property.findAll({
      where: { status: 'active' },
      include: [
        { model: PropertyImage },
        { model: State, attributes: ['id', 'name'] },
        { model: City, attributes: ['id', 'name'] },
        { model: Area, attributes: ['id', 'name'] },
        { model: PropertyType, attributes: ['id', 'name'] }
      ],
      order: [['created_at', 'DESC']],
      limit: limit
    });
    res.json({ success: true, data: properties });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Single Property
const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findByPk(req.params.id, {
      include: [
        { model: PropertyImage },
        { model: State },
        { model: City },
        { model: Area },
        { model: PropertyType, include: [PropertyCategory] }
      ]
    });
    if (!property) return res.status(404).json({ success: false, message: 'Property not found' });
    res.json({ success: true, data: property });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Admin Properties (List for Dashboard)
const getAdminProperties = async (req, res) => {
  try {
    const properties = await Property.findAll({
      include: [
        { model: PropertyType, attributes: ['id', 'name'] },
        { model: City, attributes: ['id', 'name'] },
        { model: Area, attributes: ['id', 'name'] },
        { model: State, attributes: ['id', 'name'] },
        { model: PropertyImage }
      ],
      order: [['created_at', 'DESC']]
    });
    res.json({ success: true, data: properties });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Categories
const getCategories = async (req, res) => {
  try {
    const categories = await PropertyCategory.findAll();
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Types by Category ID
const getTypes = async (req, res) => {
  try {
    const types = await PropertyType.findAll({
      where: { category_id: req.params.categoryId }
    });
    res.json({ success: true, data: types });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createProperty,
  updateProperty,
  deleteProperty,
  getProperties,
  getLatestProperties,
  getPropertyById,
  getAdminProperties,
  getCategories,
  getTypes
};
