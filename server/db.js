
const mysql = require('mysql2/promise');
require('dotenv').config();

// Create a connection pool to the MySQL database
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test database connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Successfully connected to the MySQL database');
    connection.release();
    return true;
  } catch (error) {
    console.error('Database connection error:', error);
    return false;
  }
};

module.exports = { pool, testConnection };
