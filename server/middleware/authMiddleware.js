
const jwt = require('jsonwebtoken');
const { pool } = require('../db');
const asyncHandler = require('express-async-handler');

const protect = asyncHandler(async (req, res, next) => {
  let token;
  
  // Get token from cookies or authorization header
  token = req.cookies.token;
  
  if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  
  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
  
  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database
    const [users] = await pool.query('SELECT id, name, email FROM users WHERE id = ?', [decoded.id]);
    
    if (users.length === 0) {
      res.status(401);
      throw new Error('Not authorized, user not found');
    }
    
    req.user = users[0];
    next();
  } catch (error) {
    res.status(401);
    throw new Error('Not authorized, invalid token');
  }
});

module.exports = { protect };
