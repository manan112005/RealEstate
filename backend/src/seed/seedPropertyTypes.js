const { PropertyCategory, PropertyType } = require('../models');
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

seedTaxonomy();