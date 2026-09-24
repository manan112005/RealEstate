const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const PropertyImage = sequelize.define('PropertyImage', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  cloudinary_url: { type: DataTypes.STRING, allowNull: false },
  cloudinary_public_id: { type: DataTypes.STRING, allowNull: false },
  is_primary: { type: DataTypes.BOOLEAN, defaultValue: false }
}, {
  tableName: 'property_images',
  timestamps: false
});

module.exports = PropertyImage;