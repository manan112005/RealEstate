const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Partner = sequelize.define('Partner', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  logo_cloudinary_url: { type: DataTypes.STRING },
  logo_public_id: { type: DataTypes.STRING },
  display_order: { type: DataTypes.INTEGER, defaultValue: 0 }
}, {
  tableName: 'partners',
  timestamps: false
});

module.exports = Partner;