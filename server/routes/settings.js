
const express = require('express');
const { pool } = require('../db');
const asyncHandler = require('express-async-handler');
const router = express.Router();

// Get settings
router.get('/', asyncHandler(async (req, res) => {
  const [settings] = await pool.query('SELECT * FROM settings WHERE user_id = ?', [req.user?.id || 1]);
  
  if (settings.length === 0) {
    // Return default settings
    return res.json({
      vendor: {
        name: 'Gold Jewelry Shop',
        address: '123 Jewelers Lane, Mumbai, Maharashtra',
        phone: '9876543210',
        email: 'contact@goldjewelryshop.com',
        gstNo: '27AADCG1234A1Z5',
        panNo: 'AADCG1234A',
      },
      bank: {
        accountName: 'Gold Jewelry Shop',
        accountNumber: '12345678901234',
        bankName: 'State Bank of India',
        ifscCode: 'SBIN0001234',
        branch: 'Mumbai Main Branch',
      },
      gst: {
        cgstRate: 1.5,
        sgstRate: 1.5,
        autoCalculate: true,
      },
      preferences: {
        autoSave: true,
        darkMode: false,
      },
    });
  }
  
  // Parse settings from JSON
  const settingsData = JSON.parse(settings[0].settings_data);
  
  res.json(settingsData);
}));

// Update settings
router.post('/', asyncHandler(async (req, res) => {
  const settingsData = req.body;
  const userId = req.user?.id || 1;
  
  // Check if settings exist
  const [existingSettings] = await pool.query('SELECT id FROM settings WHERE user_id = ?', [userId]);
  
  if (existingSettings.length > 0) {
    // Update existing settings
    await pool.query(
      'UPDATE settings SET settings_data = ? WHERE user_id = ?',
      [JSON.stringify(settingsData), userId]
    );
  } else {
    // Create new settings
    await pool.query(
      'INSERT INTO settings (user_id, settings_data) VALUES (?, ?)',
      [userId, JSON.stringify(settingsData)]
    );
  }
  
  res.json({ message: 'Settings saved successfully' });
}));

// Update vendor settings
router.post('/vendor', asyncHandler(async (req, res) => {
  const vendorSettings = req.body;
  const userId = req.user?.id || 1;
  
  // Get current settings
  const [settings] = await pool.query('SELECT settings_data FROM settings WHERE user_id = ?', [userId]);
  
  let currentSettings = {};
  
  if (settings.length > 0) {
    currentSettings = JSON.parse(settings[0].settings_data);
  }
  
  // Update vendor settings
  const updatedSettings = {
    ...currentSettings,
    vendor: vendorSettings
  };
  
  // Save updated settings
  if (settings.length > 0) {
    await pool.query(
      'UPDATE settings SET settings_data = ? WHERE user_id = ?',
      [JSON.stringify(updatedSettings), userId]
    );
  } else {
    await pool.query(
      'INSERT INTO settings (user_id, settings_data) VALUES (?, ?)',
      [userId, JSON.stringify(updatedSettings)]
    );
  }
  
  res.json({ message: 'Vendor settings saved successfully' });
}));

// Update bank settings
router.post('/bank', asyncHandler(async (req, res) => {
  const bankSettings = req.body;
  const userId = req.user?.id || 1;
  
  // Get current settings
  const [settings] = await pool.query('SELECT settings_data FROM settings WHERE user_id = ?', [userId]);
  
  let currentSettings = {};
  
  if (settings.length > 0) {
    currentSettings = JSON.parse(settings[0].settings_data);
  }
  
  // Update bank settings
  const updatedSettings = {
    ...currentSettings,
    bank: bankSettings
  };
  
  // Save updated settings
  if (settings.length > 0) {
    await pool.query(
      'UPDATE settings SET settings_data = ? WHERE user_id = ?',
      [JSON.stringify(updatedSettings), userId]
    );
  } else {
    await pool.query(
      'INSERT INTO settings (user_id, settings_data) VALUES (?, ?)',
      [userId, JSON.stringify(updatedSettings)]
    );
  }
  
  res.json({ message: 'Bank settings saved successfully' });
}));

// Update GST settings
router.post('/gst', asyncHandler(async (req, res) => {
  const gstSettings = req.body;
  const userId = req.user?.id || 1;
  
  // Get current settings
  const [settings] = await pool.query('SELECT settings_data FROM settings WHERE user_id = ?', [userId]);
  
  let currentSettings = {};
  
  if (settings.length > 0) {
    currentSettings = JSON.parse(settings[0].settings_data);
  }
  
  // Update GST settings
  const updatedSettings = {
    ...currentSettings,
    gst: gstSettings
  };
  
  // Save updated settings
  if (settings.length > 0) {
    await pool.query(
      'UPDATE settings SET settings_data = ? WHERE user_id = ?',
      [JSON.stringify(updatedSettings), userId]
    );
  } else {
    await pool.query(
      'INSERT INTO settings (user_id, settings_data) VALUES (?, ?)',
      [userId, JSON.stringify(updatedSettings)]
    );
  }
  
  res.json({ message: 'GST settings saved successfully' });
}));

// Update preference settings
router.post('/preferences', asyncHandler(async (req, res) => {
  const preferenceSettings = req.body;
  const userId = req.user?.id || 1;
  
  // Get current settings
  const [settings] = await pool.query('SELECT settings_data FROM settings WHERE user_id = ?', [userId]);
  
  let currentSettings = {};
  
  if (settings.length > 0) {
    currentSettings = JSON.parse(settings[0].settings_data);
  }
  
  // Update preference settings
  const updatedSettings = {
    ...currentSettings,
    preferences: preferenceSettings
  };
  
  // Save updated settings
  if (settings.length > 0) {
    await pool.query(
      'UPDATE settings SET settings_data = ? WHERE user_id = ?',
      [JSON.stringify(updatedSettings), userId]
    );
  } else {
    await pool.query(
      'INSERT INTO settings (user_id, settings_data) VALUES (?, ?)',
      [userId, JSON.stringify(updatedSettings)]
    );
  }
  
  res.json({ message: 'Preference settings saved successfully' });
}));

module.exports = router;
