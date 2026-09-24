const { State, City, Area } = require('../models');
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

seedLocations();