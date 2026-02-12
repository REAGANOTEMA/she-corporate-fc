const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: 'localhost',
  port: 5432
});

pool.connect()
  .then(() => console.log('✅ PostgreSQL Connected'))
  .catch(err => console.error('❌ PostgreSQL Error:', err));

module.exports = pool;
