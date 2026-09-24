const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const passwordsToTry = ['postgres', 'admin', 'root', 'password', '1234', '123456', ''];
const user = 'postgres';
const host = 'localhost';
const port = 5432;
const dbName = 'postgres'; // using the default 'postgres' database to test connection

async function findPassword() {
  for (const pwd of passwordsToTry) {
    const client = new Client({
      user: user,
      host: host,
      database: dbName,
      password: pwd,
      port: port,
    });
    try {
      await client.connect();
      console.log('SUCCESS_PASSWORD:' + pwd);
      await client.end();
      
      // Update .env file
      const envPath = path.join(__dirname, '.env');
      let envContent = fs.readFileSync(envPath, 'utf8');
      envContent = envContent.replace(/DB_PASSWORD=.*/, "DB_PASSWORD=" + pwd);
      fs.writeFileSync(envPath, envContent);
      console.log('.env updated successfully!');
      
      return;
    } catch (err) {
      // Failed, try next
    }
  }
  console.log('FAILED_TO_FIND_PASSWORD');
}

findPassword();
