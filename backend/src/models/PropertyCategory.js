const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const PropertyCategory = sequelize.define('PropertyCategory', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false }
}, {
  tableName: 'property_categories',
  timestamps: false
});

module.exports = PropertyCategory;