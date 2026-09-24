const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const PropertyType = sequelize.define('PropertyType', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  category_id: { type: DataTypes.INTEGER, allowNull: false }
}, {
  tableName: 'property_types',
  timestamps: false
});

module.exports = PropertyType;