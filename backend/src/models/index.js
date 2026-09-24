const { sequelize } = require('../config/db');

const User = require('./User');
const State = require('./State');
const City = require('./City');
const Area = require('./Area');
const PropertyCategory = require('./PropertyCategory');
const PropertyType = require('./PropertyType');
const Property = require('./Property');
const PropertyImage = require('./PropertyImage');
const Partner = require('./Partner');
const Service = require('./Service');
const ContactMessage = require('./ContactMessage');

// Location Hierarchy
State.hasMany(City, { foreignKey: 'state_id' });
City.belongsTo(State, { foreignKey: 'state_id' });

City.hasMany(Area, { foreignKey: 'city_id' });
Area.belongsTo(City, { foreignKey: 'city_id' });

// Property Taxonomy
PropertyCategory.hasMany(PropertyType, { foreignKey: 'category_id' });
PropertyType.belongsTo(PropertyCategory, { foreignKey: 'category_id' });

// Property Relationships
PropertyType.hasMany(Property, { foreignKey: 'property_type_id' });
Property.belongsTo(PropertyType, { foreignKey: 'property_type_id' });

State.hasMany(Property, { foreignKey: 'state_id' });
Property.belongsTo(State, { foreignKey: 'state_id' });

City.hasMany(Property, { foreignKey: 'city_id' });
Property.belongsTo(City, { foreignKey: 'city_id' });

Area.hasMany(Property, { foreignKey: 'area_id' });
Property.belongsTo(Area, { foreignKey: 'area_id' });

User.hasMany(Property, { foreignKey: 'created_by' });
Property.belongsTo(User, { foreignKey: 'created_by' });

// Partner Relationships
Partner.hasMany(Property, { foreignKey: 'partner_id' });
Property.belongsTo(Partner, { foreignKey: 'partner_id' });

// Property Images
Property.hasMany(PropertyImage, { foreignKey: 'property_id' });
PropertyImage.belongsTo(Property, { foreignKey: 'property_id' });

module.exports = {
  sequelize,
  User,
  State,
  City,
  Area,
  PropertyCategory,
  PropertyType,
  Property,
  PropertyImage,
  Partner,
  Service,
  ContactMessage
};