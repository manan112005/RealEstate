const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Area = sequelize.define('Area', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  city_id: { type: DataTypes.INTEGER, allowNull: false }
}, {
  tableName: 'areas',
  timestamps: false
});

module.exports = Area;