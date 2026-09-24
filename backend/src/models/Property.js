const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Property = sequelize.define('Property', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  bhk: { type: DataTypes.INTEGER },
  sq_feet: { type: DataTypes.NUMERIC },
  sq_yard: { type: DataTypes.NUMERIC },
  price: { type: DataTypes.NUMERIC },
  
  // New Layout Fields
  bathrooms: { type: DataTypes.INTEGER },
  balconies: { type: DataTypes.INTEGER },
  area_type: { type: DataTypes.STRING },
  maintenance_charge: { type: DataTypes.NUMERIC },
  floor_number: { type: DataTypes.STRING },
  total_floors: { type: DataTypes.STRING },
  age_of_property: { type: DataTypes.STRING },
  covered_parking: { type: DataTypes.INTEGER },
  open_parking: { type: DataTypes.INTEGER },
  furnishing_status: { type: DataTypes.STRING },
  construction_status: { type: DataTypes.STRING },
  brokerage_charge: { type: DataTypes.NUMERIC },

  // Location & Address Fields
  address_line_1: { type: DataTypes.STRING },
  flat_no: { type: DataTypes.STRING },
  property_label: { type: DataTypes.STRING },
  garage: { type: DataTypes.STRING },
  transaction_type: { type: DataTypes.STRING },
  available_from: { type: DataTypes.DATE },
  charge_brokerage: { type: DataTypes.BOOLEAN, defaultValue: false },
  partner_id: { type: DataTypes.INTEGER },

  listing_type: { 
    type: DataTypes.ENUM('sale', 'rent', 'preleased', 'auction'),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('active', 'sold', 'inactive'),
    defaultValue: 'active'
  }
}, {
  tableName: 'properties',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Property;