require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false,
  }
);

async function test() {
  try {
    await sequelize.authenticate();
    console.log('SUCCESS_CONNECTED');
  } catch (error) {
    console.log('FAIL_TO_CONNECT:', error.message);
  } finally {
    process.exit(0);
  }
}
test();
