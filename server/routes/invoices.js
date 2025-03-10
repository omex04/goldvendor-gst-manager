
const express = require('express');
const { pool } = require('../db');
const asyncHandler = require('express-async-handler');
const router = express.Router();

// Get all invoices
router.get('/', asyncHandler(async (req, res) => {
  // Get all invoices
  const [invoices] = await pool.query(`
    SELECT * FROM invoices 
    ORDER BY date DESC
  `);
  
  // Get all customers for the invoices
  const [customers] = await pool.query(`
    SELECT * FROM customers
  `);
  
  // Get all invoice items
  const [items] = await pool.query(`
    SELECT * FROM invoice_items
  `);
  
  // Map the data to match the expected format
  const formattedInvoices = invoices.map(invoice => {
    const customer = customers.find(c => c.id === invoice.customer_id) || {};
    const invoiceItems = items.filter(item => item.invoice_id === invoice.id) || [];
    
    return {
      id: invoice.id,
      invoiceNumber: invoice.invoice_number,
      date: invoice.date,
      dueDate: invoice.due_date || null,
      customer: {
        id: customer.id || '',
        name: customer.name || '',
        address: customer.address || '',
        phone: customer.phone || '',
        email: customer.email || '',
        gstNo: customer.gst_no || '',
      },
      items: invoiceItems.map(item => ({
        id: item.id,
        name: item.name,
        description: item.description || '',
        hsnCode: item.hsn_code,
        quantity: item.quantity,
        weightInGrams: item.weight_in_grams || null,
        ratePerGram: item.rate_per_gram || null,
        price: item.price,
        makingCharges: item.making_charges || null,
        cgstRate: item.cgst_rate,
        sgstRate: item.sgst_rate,
        cgstAmount: item.cgst_amount,
        sgstAmount: item.sgst_amount,
        totalAmount: item.total_amount,
      })),
      subtotal: invoice.subtotal,
      cgstTotal: invoice.cgst_total,
      sgstTotal: invoice.sgst_total,
      grandTotal: invoice.grand_total,
      notes: invoice.notes || '',
      status: invoice.status,
      paidAmount: invoice.paid_amount || null,
      paidDate: invoice.paid_date || null,
      paymentMethod: invoice.payment_method || '',
    };
  });
  
  res.json(formattedInvoices);
}));

// Get invoice by ID
router.get('/:id', asyncHandler(async (req, res) => {
  const invoiceId = req.params.id;
  
  // Get invoice
  const [invoices] = await pool.query(`
    SELECT * FROM invoices 
    WHERE id = ?
  `, [invoiceId]);
  
  if (invoices.length === 0) {
    return res.status(404).json({ message: 'Invoice not found' });
  }
  
  const invoice = invoices[0];
  
  // Get customer
  const [customers] = await pool.query(`
    SELECT * FROM customers 
    WHERE id = ?
  `, [invoice.customer_id]);
  
  if (customers.length === 0) {
    return res.status(404).json({ message: 'Customer not found' });
  }
  
  const customer = customers[0];
  
  // Get invoice items
  const [items] = await pool.query(`
    SELECT * FROM invoice_items 
    WHERE invoice_id = ?
  `, [invoiceId]);
  
  const formattedInvoice = {
    id: invoice.id,
    invoiceNumber: invoice.invoice_number,
    date: invoice.date,
    dueDate: invoice.due_date || null,
    customer: {
      id: customer.id,
      name: customer.name,
      address: customer.address,
      phone: customer.phone,
      email: customer.email || '',
      gstNo: customer.gst_no || '',
    },
    items: items.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description || '',
      hsnCode: item.hsn_code,
      quantity: item.quantity,
      weightInGrams: item.weight_in_grams || null,
      ratePerGram: item.rate_per_gram || null,
      price: item.price,
      makingCharges: item.making_charges || null,
      cgstRate: item.cgst_rate,
      sgstRate: item.sgst_rate,
      cgstAmount: item.cgst_amount,
      sgstAmount: item.sgst_amount,
      totalAmount: item.total_amount,
    })),
    subtotal: invoice.subtotal,
    cgstTotal: invoice.cgst_total,
    sgstTotal: invoice.sgst_total,
    grandTotal: invoice.grand_total,
    notes: invoice.notes || '',
    status: invoice.status,
    paidAmount: invoice.paid_amount || null,
    paidDate: invoice.paid_date || null,
    paymentMethod: invoice.payment_method || '',
  };
  
  res.json(formattedInvoice);
}));

// Create or update invoice
router.post('/', asyncHandler(async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const invoice = req.body;
    let customerId = invoice.customer.id;
    
    // Create or update customer
    if (customerId) {
      await connection.query(`
        UPDATE customers SET
        name = ?,
        address = ?,
        phone = ?,
        email = ?,
        gst_no = ?
        WHERE id = ?
      `, [
        invoice.customer.name,
        invoice.customer.address,
        invoice.customer.phone,
        invoice.customer.email || null,
        invoice.customer.gstNo || null,
        customerId
      ]);
    } else {
      const [customerResult] = await connection.query(`
        INSERT INTO customers (name, address, phone, email, gst_no)
        VALUES (?, ?, ?, ?, ?)
      `, [
        invoice.customer.name,
        invoice.customer.address,
        invoice.customer.phone,
        invoice.customer.email || null,
        invoice.customer.gstNo || null
      ]);
      
      customerId = customerResult.insertId;
    }
    
    // Create or update invoice
    let invoiceId = invoice.id;
    let result;
    
    if (invoiceId) {
      // Update existing invoice
      await connection.query(`
        UPDATE invoices SET
        invoice_number = ?,
        date = ?,
        due_date = ?,
        customer_id = ?,
        subtotal = ?,
        cgst_total = ?,
        sgst_total = ?,
        grand_total = ?,
        notes = ?,
        status = ?,
        paid_amount = ?,
        paid_date = ?,
        payment_method = ?
        WHERE id = ?
      `, [
        invoice.invoiceNumber,
        new Date(invoice.date),
        invoice.dueDate ? new Date(invoice.dueDate) : null,
        customerId,
        invoice.subtotal,
        invoice.cgstTotal,
        invoice.sgstTotal,
        invoice.grandTotal,
        invoice.notes || null,
        invoice.status,
        invoice.paidAmount || null,
        invoice.paidDate ? new Date(invoice.paidDate) : null,
        invoice.paymentMethod || null,
        invoiceId
      ]);
    } else {
      // Create new invoice
      [result] = await connection.query(`
        INSERT INTO invoices (
          invoice_number, date, due_date, customer_id, subtotal,
          cgst_total, sgst_total, grand_total, notes, status,
          paid_amount, paid_date, payment_method
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        invoice.invoiceNumber,
        new Date(invoice.date),
        invoice.dueDate ? new Date(invoice.dueDate) : null,
        customerId,
        invoice.subtotal,
        invoice.cgstTotal,
        invoice.sgstTotal,
        invoice.grandTotal,
        invoice.notes || null,
        invoice.status,
        invoice.paidAmount || null,
        invoice.paidDate ? new Date(invoice.paidDate) : null,
        invoice.paymentMethod || null
      ]);
      
      invoiceId = result.insertId;
    }
    
    // Delete existing invoice items if updating
    if (invoice.id) {
      await connection.query('DELETE FROM invoice_items WHERE invoice_id = ?', [invoiceId]);
    }
    
    // Create invoice items
    const itemValues = invoice.items.map(item => [
      invoiceId,
      item.name,
      item.description || null,
      item.hsnCode,
      item.quantity,
      item.weightInGrams || null,
      item.ratePerGram || null,
      item.price,
      item.makingCharges || null,
      item.cgstRate,
      item.sgstRate,
      item.cgstAmount,
      item.sgstAmount,
      item.totalAmount
    ]);
    
    if (itemValues.length > 0) {
      await connection.query(`
        INSERT INTO invoice_items (
          invoice_id, name, description, hsn_code, quantity,
          weight_in_grams, rate_per_gram, price, making_charges,
          cgst_rate, sgst_rate, cgst_amount, sgst_amount, total_amount
        )
        VALUES ?
      `, [itemValues]);
    }
    
    await connection.commit();
    
    res.status(201).json({ id: invoiceId, message: 'Invoice saved successfully' });
  } catch (error) {
    await connection.rollback();
    console.error('Error saving invoice:', error);
    res.status(500).json({ message: 'Failed to save invoice', error: error.message });
  } finally {
    connection.release();
  }
}));

// Mark invoice as paid
router.patch('/:id/mark-paid', asyncHandler(async (req, res) => {
  const invoiceId = req.params.id;
  
  const [result] = await pool.query(`
    UPDATE invoices SET
    status = 'paid',
    paid_date = ?
    WHERE id = ?
  `, [new Date(), invoiceId]);
  
  if (result.affectedRows === 0) {
    return res.status(404).json({ message: 'Invoice not found' });
  }
  
  res.json({ message: 'Invoice marked as paid' });
}));

// Delete invoice
router.delete('/:id', asyncHandler(async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const invoiceId = req.params.id;
    
    // Delete invoice items
    await connection.query('DELETE FROM invoice_items WHERE invoice_id = ?', [invoiceId]);
    
    // Delete invoice
    const [result] = await connection.query('DELETE FROM invoices WHERE id = ?', [invoiceId]);
    
    if (result.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({ message: 'Invoice not found' });
    }
    
    await connection.commit();
    
    res.json({ message: 'Invoice deleted successfully' });
  } catch (error) {
    await connection.rollback();
    console.error('Error deleting invoice:', error);
    res.status(500).json({ message: 'Failed to delete invoice' });
  } finally {
    connection.release();
  }
}));

module.exports = router;
