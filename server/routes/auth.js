
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../db');
const asyncHandler = require('express-async-handler');
const router = express.Router();

// Register a new user
router.post('/register', asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  
  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }
  
  // Check if user already exists
  const [existingUsers] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  
  if (existingUsers.length > 0) {
    return res.status(400).json({ message: 'User already exists' });
  }
  
  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  
  // Create user
  const [result] = await pool.query(
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
    [name, email, hashedPassword]
  );
  
  if (result.affectedRows === 1) {
    const userId = result.insertId;
    
    // Generate token
    const token = jwt.sign(
      { id: userId, name, email },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );
    
    // Set token in cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });
    
    res.status(201).json({
      id: userId,
      name,
      email,
      token
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
}));

// Login user
router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  
  // Check if user exists
  const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  
  if (users.length === 0) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }
  
  const user = users[0];
  
  // Check password
  const isMatch = await bcrypt.compare(password, user.password);
  
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }
  
  // Generate token
  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
  
  // Set token in cookie
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
  });
  
  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    token
  });
}));

// Logout user
router.post('/logout', (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0)
  });
  
  res.status(200).json({ message: 'User logged out' });
});

// Get current user
router.get('/me', asyncHandler(async (req, res) => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
  
  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database
    const [users] = await pool.query('SELECT id, name, email FROM users WHERE id = ?', [decoded.id]);
    
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(users[0]);
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, invalid token' });
  }
}));

module.exports = router;
