
const express = require('express');
const { pool } = require('../db');
const asyncHandler = require('express-async-handler');
const router = express.Router();

// Get all customers
router.get('/', asyncHandler(async (req, res) => {
  const [customers] = await pool.query('SELECT * FROM customers ORDER BY name');
  
  const formattedCustomers = customers.map(customer => ({
    id: customer.id,
    name: customer.name,
    address: customer.address,
    phone: customer.phone,
    email: customer.email || '',
    gstNo: customer.gst_no || '',
  }));
  
  res.json(formattedCustomers);
}));

// Get customer by ID
router.get('/:id', asyncHandler(async (req, res) => {
  const [customers] = await pool.query('SELECT * FROM customers WHERE id = ?', [req.params.id]);
  
  if (customers.length === 0) {
    return res.status(404).json({ message: 'Customer not found' });
  }
  
  const customer = customers[0];
  
  res.json({
    id: customer.id,
    name: customer.name,
    address: customer.address,
    phone: customer.phone,
    email: customer.email || '',
    gstNo: customer.gst_no || '',
  });
}));

// Create customer
router.post('/', asyncHandler(async (req, res) => {
  const { name, address, phone, email, gstNo } = req.body;
  
  if (!name || !address || !phone) {
    return res.status(400).json({ message: 'Please provide required fields' });
  }
  
  const [result] = await pool.query(`
    INSERT INTO customers (name, address, phone, email, gst_no)
    VALUES (?, ?, ?, ?, ?)
  `, [name, address, phone, email || null, gstNo || null]);
  
  res.status(201).json({
    id: result.insertId,
    name,
    address,
    phone,
    email: email || '',
    gstNo: gstNo || '',
  });
}));

// Update customer
router.put('/:id', asyncHandler(async (req, res) => {
  const { name, address, phone, email, gstNo } = req.body;
  
  if (!name || !address || !phone) {
    return res.status(400).json({ message: 'Please provide required fields' });
  }
  
  const [result] = await pool.query(`
    UPDATE customers SET
    name = ?,
    address = ?,
    phone = ?,
    email = ?,
    gst_no = ?
    WHERE id = ?
  `, [name, address, phone, email || null, gstNo || null, req.params.id]);
  
  if (result.affectedRows === 0) {
    return res.status(404).json({ message: 'Customer not found' });
  }
  
  res.json({
    id: req.params.id,
    name,
    address,
    phone,
    email: email || '',
    gstNo: gstNo || '',
  });
}));

// Delete customer
router.delete('/:id', asyncHandler(async (req, res) => {
  // Check if customer has invoices
  const [invoices] = await pool.query('SELECT id FROM invoices WHERE customer_id = ?', [req.params.id]);
  
  if (invoices.length > 0) {
    return res.status(400).json({ 
      message: 'Cannot delete customer with invoices. Delete invoices first.' 
    });
  }
  
  const [result] = await pool.query('DELETE FROM customers WHERE id = ?', [req.params.id]);
  
  if (result.affectedRows === 0) {
    return res.status(404).json({ message: 'Customer not found' });
  }
  
  res.json({ message: 'Customer deleted successfully' });
}));

module.exports = router;
