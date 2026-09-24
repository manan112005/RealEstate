const fs = require('fs');
const path = require('path');

const modelsDir = path.join(__dirname, 'backend', 'src', 'models');
const seedDir = path.join(__dirname, 'backend', 'src', 'seed');
fs.mkdirSync(modelsDir, { recursive: true });
fs.mkdirSync(seedDir, { recursive: true });

const models = {
  'User.js': `const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  phone: { type: DataTypes.STRING },
  password_hash: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, defaultValue: 'admin' }
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = User;`,

  'State.js': `const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const State = sequelize.define('State', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false }
}, {
  tableName: 'states',
  timestamps: false
});

module.exports = State;`,

  'City.js': `const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const City = sequelize.define('City', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  state_id: { type: DataTypes.INTEGER, allowNull: false }
}, {
  tableName: 'cities',
  timestamps: false
});

module.exports = City;`,

  'Area.js': `const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Area = sequelize.define('Area', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  city_id: { type: DataTypes.INTEGER, allowNull: false }
}, {
  tableName: 'areas',
  timestamps: false
});

module.exports = Area;`,

  'PropertyCategory.js': `const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const PropertyCategory = sequelize.define('PropertyCategory', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false }
}, {
  tableName: 'property_categories',
  timestamps: false
});

module.exports = PropertyCategory;`,

  'PropertyType.js': `const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const PropertyType = sequelize.define('PropertyType', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  category_id: { type: DataTypes.INTEGER, allowNull: false }
}, {
  tableName: 'property_types',
  timestamps: false
});

module.exports = PropertyType;`,

  'Property.js': `const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Property = sequelize.define('Property', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  bhk: { type: DataTypes.INTEGER },
  sq_feet: { type: DataTypes.NUMERIC },
  sq_yard: { type: DataTypes.NUMERIC },
  price: { type: DataTypes.NUMERIC },
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

module.exports = Property;`,

  'PropertyImage.js': `const { DataTypes } = require('sequelize');
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

module.exports = PropertyImage;`,

  'Partner.js': `const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Partner = sequelize.define('Partner', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  logo_cloudinary_url: { type: DataTypes.STRING },
  display_order: { type: DataTypes.INTEGER, defaultValue: 0 }
}, {
  tableName: 'partners',
  timestamps: false
});

module.exports = Partner;`,

  'Service.js': `const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Service = sequelize.define('Service', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  image_url: { type: DataTypes.STRING },
  description: { type: DataTypes.TEXT },
  slug: { type: DataTypes.STRING, unique: true }
}, {
  tableName: 'services',
  timestamps: false
});

module.exports = Service;`,

  'ContactMessage.js': `const { DataTypes } = require('sequelize');
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

module.exports = ContactMessage;`,

  'index.js': `const { sequelize } = require('../config/db');

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
};`,

  'sync.js': `const { sequelize } = require('./index');

sequelize.sync({ alter: true }).then(() => {
  console.log('Database synced successfully');
  process.exit(0);
}).catch((err) => {
  console.error('Error syncing database:', err);
  process.exit(1);
});`
};

for (const [filename, content] of Object.entries(models)) {
  fs.writeFileSync(path.join(modelsDir, filename), content);
}
console.log('Models generated.');

const seeds = {
  'seedLocations.js': `const { State, City, Area } = require('../models');
const { sequelize } = require('../config/db');

const states = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
];

const gujaratCities = [
  {
    name: 'Ahmedabad',
    areas: ['Bopal', 'Satellite', 'SG Highway', 'Vastrapur', 'Navrangpura', 'Maninagar', 'Gota', 'Science City']
  },
  {
    name: 'Surat',
    areas: ['Vesu', 'Adajan', 'Varachha', 'Piplod', 'Palsana']
  },
  {
    name: 'Vadodara',
    areas: ['Alkapuri', 'Karelibaug', 'Gotri', 'Manjalpur', 'Sayajigunj']
  },
  {
    name: 'Rajkot',
    areas: ['Kalawad Road', 'University Road', 'Amin Marg', 'Nana Mava']
  },
  {
    name: 'Gandhinagar',
    areas: ['Kudasan', 'Sargasan', 'Sector 21', 'Gift City', 'Randesan']
  }
];

const seedLocations = async () => {
  try {
    await sequelize.sync();
    console.log('Seeding states...');
    
    for (const stateName of states) {
      await State.findOrCreate({ where: { name: stateName } });
    }
    
    const gujarat = await State.findOne({ where: { name: 'Gujarat' } });
    
    if (gujarat) {
      console.log('Seeding Gujarat cities and areas...');
      for (const cityData of gujaratCities) {
        const [city] = await City.findOrCreate({
          where: { name: cityData.name, state_id: gujarat.id }
        });
        
        for (const areaName of cityData.areas) {
          await Area.findOrCreate({
            where: { name: areaName, city_id: city.id }
          });
        }
      }
    }
    
    console.log('Locations seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding locations:', error);
    process.exit(1);
  }
};

seedLocations();`,

  'seedTaxonomy.js': `const { PropertyCategory, PropertyType } = require('../models');
const { sequelize } = require('../config/db');

const taxonomy = [
  { category: 'Residential', types: ['Flat/Apartment', 'Villa', 'Raw House', 'Tenament', 'Duplex'] },
  { category: 'Commercial', types: ['Shop', 'Independent Plot', 'Commercial Space', 'Office', 'Show Room', 'Ware House'] },
  { category: 'Pre Leased', types: ['Penthouse'] },
  { category: 'Bank Auction', types: [] },
  { category: 'Land', types: [] },
  { category: 'Farm House', types: [] },
  { category: 'Plots', types: [] },
  { category: 'Investments', types: [] },
  { category: 'Loan', types: [] }
];

const seedTaxonomy = async () => {
  try {
    await sequelize.sync();
    console.log('Seeding taxonomy...');
    
    for (const item of taxonomy) {
      const [category] = await PropertyCategory.findOrCreate({
        where: { name: item.category }
      });
      
      for (const typeName of item.types) {
        await PropertyType.findOrCreate({
          where: { name: typeName, category_id: category.id }
        });
      }
    }
    
    console.log('Taxonomy seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding taxonomy:', error);
    process.exit(1);
  }
};

seedTaxonomy();`
};

for (const [filename, content] of Object.entries(seeds)) {
  fs.writeFileSync(path.join(seedDir, filename), content);
}
console.log('Seeds generated.');
