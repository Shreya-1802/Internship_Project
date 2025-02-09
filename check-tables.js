const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkTables() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: {
        rejectUnauthorized: false
      }
    });

    console.log('Connected to database');

    // Get table structures
    const [tables] = await connection.execute('SHOW TABLES');
    console.log('\nTables in database:', tables.map(t => Object.values(t)[0]));

    for (const table of tables.map(t => Object.values(t)[0])) {
      console.log(`\nStructure of ${table} table:`);
      const [columns] = await connection.execute(`DESCRIBE ${table}`);
      console.log(columns);
    }

    await connection.end();
  } catch (error) {
    console.error('Error:', error);
  }
}

checkTables(); 