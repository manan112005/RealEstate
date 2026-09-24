const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Service = sequelize.define('Service', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  image_url: { type: DataTypes.STRING },
  image_public_id: { type: DataTypes.STRING },
  description: { type: DataTypes.TEXT },
  slug: { type: DataTypes.STRING, unique: true }
}, {
  tableName: 'services',
  timestamps: false
});

module.exports = Service;