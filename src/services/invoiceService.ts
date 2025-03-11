
import { Invoice, InvoiceItem, Customer } from '@/types';
import { localDB, TABLES } from '@/lib/localStorage';

export async function fetchInvoices(): Promise<Invoice[]> {
  try {
    // Get all invoices from local storage
    const invoicesData = localDB.select(TABLES.INVOICES);
    
    // Get all customers and invoice items
    const customersData = localDB.select(TABLES.CUSTOMERS);
    const itemsData = localDB.select(TABLES.INVOICE_ITEMS);
    
    // Map the data to our Invoice type
    const invoices: Invoice[] = invoicesData.map((invoice: any) => {
      const customer = customersData.find((c: any) => c.id === invoice.customer_id);
      const items = itemsData.filter((item: any) => item.invoice_id === invoice.id);
      
      return {
        id: invoice.id,
        invoiceNumber: invoice.invoice_number,
        date: new Date(invoice.date),
        dueDate: invoice.due_date ? new Date(invoice.due_date) : undefined,
        customer: {
          id: customer?.id || '',
          name: customer?.name || '',
          address: customer?.address || '',
          phone: customer?.phone || '',
          email: customer?.email || '',
          gstNo: customer?.gst_no || '',
        },
        items: items.map((item: any) => ({
          id: item.id,
          name: item.name,
          description: item.description || undefined,
          hsnCode: item.hsn_code,
          quantity: item.quantity,
          weightInGrams: item.weight_in_grams || undefined,
          ratePerGram: item.rate_per_gram || undefined,
          price: item.price,
          makingCharges: item.making_charges || undefined,
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
        notes: invoice.notes || undefined,
        status: invoice.status as "draft" | "sent" | "paid" | "cancelled",
        paidAmount: invoice.paid_amount || undefined,
        paidDate: invoice.paid_date ? new Date(invoice.paid_date) : undefined,
        paymentMethod: invoice.payment_method || undefined,
      };
    });
    
    return invoices;
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return [];
  }
}

export async function getInvoiceById(id: string): Promise<Invoice | null> {
  try {
    // Get invoice from local storage
    const invoice = localDB.selectSingle(TABLES.INVOICES, { column: 'id', value: id });
    
    if (!invoice) {
      return null;
    }
    
    // Get customer data
    const customer = localDB.selectSingle(TABLES.CUSTOMERS, { column: 'id', value: invoice.customer_id });
    
    if (!customer) {
      return null;
    }
    
    // Get invoice items
    const items = localDB.select(TABLES.INVOICE_ITEMS, { column: 'invoice_id', value: id });
    
    return {
      id: invoice.id,
      invoiceNumber: invoice.invoice_number,
      date: new Date(invoice.date),
      dueDate: invoice.due_date ? new Date(invoice.due_date) : undefined,
      customer: {
        id: customer.id,
        name: customer.name,
        address: customer.address,
        phone: customer.phone,
        email: customer.email || '',
        gstNo: customer.gst_no || '',
      },
      items: items.map((item: any) => ({
        id: item.id,
        name: item.name,
        description: item.description || undefined,
        hsnCode: item.hsn_code,
        quantity: item.quantity,
        weightInGrams: item.weight_in_grams || undefined,
        ratePerGram: item.rate_per_gram || undefined,
        price: item.price,
        makingCharges: item.making_charges || undefined,
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
      notes: invoice.notes || undefined,
      status: invoice.status as "draft" | "sent" | "paid" | "cancelled",
      paidAmount: invoice.paid_amount || undefined,
      paidDate: invoice.paid_date ? new Date(invoice.paid_date) : undefined,
      paymentMethod: invoice.payment_method || undefined,
    };
  } catch (error) {
    console.error('Error fetching invoice:', error);
    return null;
  }
}

export async function saveInvoice(invoice: Invoice): Promise<string> {
  try {
    // First, save or update customer
    const { data: customer } = localDB.upsert(TABLES.CUSTOMERS, {
      id: invoice.customer.id || undefined,
      name: invoice.customer.name,
      address: invoice.customer.address,
      phone: invoice.customer.phone,
      email: invoice.customer.email || null,
      gst_no: invoice.customer.gstNo || null,
    });
    
    if (!customer || !customer[0]) {
      throw new Error('Failed to save customer');
    }
    
    // Then, save or update invoice
    const { data: savedInvoice } = localDB.upsert(TABLES.INVOICES, {
      id: invoice.id || undefined,
      invoice_number: invoice.invoiceNumber,
      date: invoice.date.toISOString(),
      due_date: invoice.dueDate ? invoice.dueDate.toISOString() : null,
      customer_id: customer[0].id,
      subtotal: invoice.subtotal,
      cgst_total: invoice.cgstTotal,
      sgst_total: invoice.sgstTotal,
      grand_total: invoice.grandTotal,
      notes: invoice.notes || null,
      status: invoice.status,
      paid_amount: invoice.paidAmount || null,
      paid_date: invoice.paidDate ? invoice.paidDate.toISOString() : null,
      payment_method: invoice.paymentMethod || null,
    });
    
    if (!savedInvoice || !savedInvoice[0]) {
      throw new Error('Failed to save invoice');
    }
    
    // Finally, save or update invoice items
    const invoiceItems = invoice.items.map(item => ({
      id: item.id || undefined,
      invoice_id: savedInvoice[0].id,
      name: item.name,
      description: item.description || null,
      hsn_code: item.hsnCode,
      quantity: item.quantity,
      weight_in_grams: item.weightInGrams || null,
      rate_per_gram: item.ratePerGram || null,
      price: item.price,
      making_charges: item.makingCharges || null,
      cgst_rate: item.cgstRate,
      sgst_rate: item.sgstRate,
      cgst_amount: item.cgstAmount,
      sgst_amount: item.sgstAmount,
      total_amount: item.totalAmount,
    }));
    
    // Remove existing items for this invoice to prevent duplicates
    localDB.delete(TABLES.INVOICE_ITEMS, { column: 'invoice_id', value: savedInvoice[0].id });
    
    // Add new items
    const { error: itemsError } = localDB.insert(TABLES.INVOICE_ITEMS, invoiceItems);
    
    if (itemsError) {
      throw new Error('Failed to save invoice items');
    }
    
    return savedInvoice[0].id;
  } catch (error: any) {
    console.error('Error saving invoice:', error);
    throw new Error(error.message || 'Failed to save invoice');
  }
}

export async function markInvoiceAsPaid(id: string): Promise<void> {
  try {
    const { error } = localDB.update(TABLES.INVOICES, {
      status: 'paid',
      paid_date: new Date().toISOString(),
    }, { column: 'id', value: id });
    
    if (error) {
      throw new Error('Failed to mark invoice as paid');
    }
  } catch (error: any) {
    console.error('Error marking invoice as paid:', error);
    throw new Error(error.message || 'Failed to mark invoice as paid');
  }
}

export async function deleteInvoice(id: string): Promise<void> {
  try {
    // First delete related invoice items
    const { error: itemsError } = localDB.delete(TABLES.INVOICE_ITEMS, { column: 'invoice_id', value: id });
    
    if (itemsError) {
      throw new Error('Failed to delete invoice items');
    }
    
    // Then delete the invoice
    const { error: invoiceError } = localDB.delete(TABLES.INVOICES, { column: 'id', value: id });
    
    if (invoiceError) {
      throw new Error('Failed to delete invoice');
    }
  } catch (error: any) {
    console.error('Error deleting invoice:', error);
    throw new Error(error.message || 'Failed to delete invoice');
  }
}
