import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/lib/supabase';
import { Invoice, InvoiceItem, Customer } from '@/types';

// Mock data for invoices
const mockInvoices: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'INV-001',
    date: new Date('2023-05-10'),
    dueDate: new Date('2023-05-17'),
    customer: {
      id: 'c1',
      name: 'Rajesh Sharma',
      address: '123 Gandhi Road, Mumbai',
      phone: '9876543210',
      email: 'rajesh@example.com',
      gstNo: '27AADCG1234A1Z5',
    },
    items: [
      {
        id: 'i1',
        name: 'Gold Ring 22KT',
        hsnCode: '7113',
        quantity: 1,
        weightInGrams: 10,
        ratePerGram: 5500,
        price: 55000,
        makingCharges: 2500,
        cgstRate: 1.5,
        sgstRate: 1.5,
        cgstAmount: 862.5,
        sgstAmount: 862.5,
        totalAmount: 59225,
      }
    ],
    subtotal: 57500,
    cgstTotal: 862.5,
    sgstTotal: 862.5,
    grandTotal: 59225,
    status: 'paid',
    paidAmount: 59225,
    paidDate: new Date('2023-05-11'),
    paymentMethod: 'Cash/UPI/Bank Transfer',
  },
  {
    id: '2',
    invoiceNumber: 'INV-002',
    date: new Date('2023-05-15'),
    dueDate: new Date('2023-05-22'),
    customer: {
      id: 'c2',
      name: 'Priya Patel',
      address: '45 Marine Drive, Mumbai',
      phone: '8907654321',
      email: 'priya@example.com',
      gstNo: '',
    },
    items: [
      {
        id: 'i2',
        name: 'Gold Necklace 24KT',
        hsnCode: '7113',
        quantity: 1,
        weightInGrams: 20,
        ratePerGram: 6000,
        price: 120000,
        makingCharges: 5000,
        cgstRate: 1.5,
        sgstRate: 1.5,
        cgstAmount: 1875,
        sgstAmount: 1875,
        totalAmount: 128750,
      }
    ],
    subtotal: 125000,
    cgstTotal: 1875,
    sgstTotal: 1875,
    grandTotal: 128750,
    status: 'sent',
    notes: 'Please make payment within due date',
  },
  {
    id: '3',
    invoiceNumber: 'INV-003',
    date: new Date('2023-05-20'),
    dueDate: new Date('2023-05-27'),
    customer: {
      id: 'c3',
      name: 'Amit Desai',
      address: '78 Juhu Beach Road, Mumbai',
      phone: '7654321890',
      email: 'amit@example.com',
      gstNo: '27AABCD5678E1Z8',
    },
    items: [
      {
        id: 'i3',
        name: 'Gold Bracelet 22KT',
        hsnCode: '7113',
        quantity: 1,
        weightInGrams: 15,
        ratePerGram: 5500,
        price: 82500,
        makingCharges: 3500,
        cgstRate: 1.5,
        sgstRate: 1.5,
        cgstAmount: 1290,
        sgstAmount: 1290,
        totalAmount: 88580,
      }
    ],
    subtotal: 86000,
    cgstTotal: 1290,
    sgstTotal: 1290,
    grandTotal: 88580,
    status: 'pending',
  },
];

// Mock data storage
let invoicesData = [...mockInvoices];

// Fetch all invoices
export async function fetchInvoices(): Promise<Invoice[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return invoicesData;
}

// Get invoice by ID
export async function getInvoiceById(id: string): Promise<Invoice | null> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  const invoice = invoicesData.find(inv => inv.id === id);
  return invoice || null;
}

// Save invoice
export async function saveInvoice(invoice: Invoice): Promise<string> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // New invoice
  if (!invoicesData.some(inv => inv.id === invoice.id)) {
    const newInvoice = {
      ...invoice,
      id: invoice.id || uuidv4(),
    };
    invoicesData.push(newInvoice);
    return newInvoice.id;
  } 
  // Update existing invoice
  else {
    invoicesData = invoicesData.map(inv => 
      inv.id === invoice.id ? { ...invoice } : inv
    );
    return invoice.id;
  }
}

// Mark invoice as paid
export async function markInvoiceAsPaid(id: string): Promise<void> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  invoicesData = invoicesData.map(invoice => {
    if (invoice.id === id) {
      return {
        ...invoice,
        status: 'paid',
        paidDate: new Date(),
      };
    }
    return invoice;
  });
}

// Delete invoice
export async function deleteInvoice(id: string): Promise<void> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  invoicesData = invoicesData.filter(invoice => invoice.id !== id);
}
