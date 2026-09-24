const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const City = sequelize.define('City', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  state_id: { type: DataTypes.INTEGER, allowNull: false }
}, {
  tableName: 'cities',
  timestamps: false
});

module.exports = City;