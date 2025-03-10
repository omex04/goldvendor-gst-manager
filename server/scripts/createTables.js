
const mysql = require('mysql2/promise');
require('dotenv').config();

const createTables = async () => {
  let connection;
  
  try {
    // Create database connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      multipleStatements: true
    });
    
    // Create database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
    
    // Use the database
    await connection.query(`USE ${process.env.DB_NAME}`);
    
    console.log(`Connected to database: ${process.env.DB_NAME}`);
    
    // Create users table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Users table created');
    
    // Create customers table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS customers (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        address TEXT NOT NULL,
        phone VARCHAR(20) NOT NULL,
        email VARCHAR(100),
        gst_no VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Customers table created');
    
    // Create invoices table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS invoices (
        id INT PRIMARY KEY AUTO_INCREMENT,
        invoice_number VARCHAR(20) NOT NULL,
        date DATE NOT NULL,
        due_date DATE,
        customer_id INT NOT NULL,
        subtotal DECIMAL(12, 2) NOT NULL,
        cgst_total DECIMAL(12, 2) NOT NULL,
        sgst_total DECIMAL(12, 2) NOT NULL,
        grand_total DECIMAL(12, 2) NOT NULL,
        notes TEXT,
        status VARCHAR(20) NOT NULL,
        paid_amount DECIMAL(12, 2),
        paid_date DATE,
        payment_method VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (customer_id) REFERENCES customers(id)
      )
    `);
    console.log('Invoices table created');
    
    // Create invoice_items table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS invoice_items (
        id INT PRIMARY KEY AUTO_INCREMENT,
        invoice_id INT NOT NULL,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        hsn_code VARCHAR(20) NOT NULL,
        quantity INT NOT NULL,
        weight_in_grams DECIMAL(12, 3),
        rate_per_gram DECIMAL(12, 2),
        price DECIMAL(12, 2) NOT NULL,
        making_charges DECIMAL(12, 2),
        cgst_rate DECIMAL(5, 2) NOT NULL,
        sgst_rate DECIMAL(5, 2) NOT NULL,
        cgst_amount DECIMAL(12, 2) NOT NULL,
        sgst_amount DECIMAL(12, 2) NOT NULL,
        total_amount DECIMAL(12, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (invoice_id) REFERENCES invoices(id)
      )
    `);
    console.log('Invoice items table created');
    
    // Create settings table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS settings (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        settings_data JSON NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);
    console.log('Settings table created');
    
    console.log('All tables created successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed');
    }
  }
};

createTables();
