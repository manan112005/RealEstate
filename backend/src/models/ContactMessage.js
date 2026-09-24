const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const ContactMessage = sequelize.define('ContactMessage', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING },
  message: { type: DataTypes.TEXT, allowNull: false }
}, {
  tableName: 'contact_messages',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = ContactMessage;