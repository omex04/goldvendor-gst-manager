
import { supabase } from '@/lib/supabase';
import { Invoice, InvoiceItem, Customer } from '@/types';

export async function fetchInvoices(): Promise<Invoice[]> {
  const { data: invoicesData, error: invoicesError } = await supabase
    .from('invoices')
    .select('*');

  if (invoicesError) {
    console.error('Error fetching invoices:', invoicesError);
    return [];
  }

  // Get all customers for the invoices
  const { data: customersData, error: customersError } = await supabase
    .from('customers')
    .select('*');

  if (customersError) {
    console.error('Error fetching customers:', customersError);
    return [];
  }

  // Get all invoice items
  const { data: itemsData, error: itemsError } = await supabase
    .from('invoice_items')
    .select('*');

  if (itemsError) {
    console.error('Error fetching invoice items:', itemsError);
    return [];
  }

  // Map the data to our Invoice type
  const invoices: Invoice[] = invoicesData.map(invoice => {
    const customer = customersData.find(c => c.id === invoice.customer_id);
    const items = itemsData.filter(item => item.invoice_id === invoice.id);

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
      items: items.map(item => ({
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
}

export async function getInvoiceById(id: string): Promise<Invoice | null> {
  const { data: invoice, error: invoiceError } = await supabase
    .from('invoices')
    .select('*')
    .eq('id', id)
    .single();

  if (invoiceError) {
    console.error('Error fetching invoice:', invoiceError);
    return null;
  }

  // Get customer data
  const { data: customer, error: customerError } = await supabase
    .from('customers')
    .select('*')
    .eq('id', invoice.customer_id)
    .single();

  if (customerError) {
    console.error('Error fetching customer:', customerError);
    return null;
  }

  // Get invoice items
  const { data: items, error: itemsError } = await supabase
    .from('invoice_items')
    .select('*')
    .eq('invoice_id', id);

  if (itemsError) {
    console.error('Error fetching invoice items:', itemsError);
    return null;
  }

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
    items: items.map(item => ({
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
}

export async function saveInvoice(invoice: Invoice): Promise<string> {
  // First, save or update customer
  const { data: customer, error: customerError } = await supabase
    .from('customers')
    .upsert({
      id: invoice.customer.id || undefined,
      name: invoice.customer.name,
      address: invoice.customer.address,
      phone: invoice.customer.phone,
      email: invoice.customer.email || null,
      gst_no: invoice.customer.gstNo || null,
    })
    .select()
    .single();

  if (customerError) {
    console.error('Error saving customer:', customerError);
    throw new Error('Failed to save customer');
  }

  // Then, save or update invoice
  const { data: savedInvoice, error: invoiceError } = await supabase
    .from('invoices')
    .upsert({
      id: invoice.id || undefined,
      invoice_number: invoice.invoiceNumber,
      date: invoice.date.toISOString(),
      due_date: invoice.dueDate ? invoice.dueDate.toISOString() : null,
      customer_id: customer.id,
      subtotal: invoice.subtotal,
      cgst_total: invoice.cgstTotal,
      sgst_total: invoice.sgstTotal,
      grand_total: invoice.grandTotal,
      notes: invoice.notes || null,
      status: invoice.status,
      paid_amount: invoice.paidAmount || null,
      paid_date: invoice.paidDate ? invoice.paidDate.toISOString() : null,
      payment_method: invoice.paymentMethod || null,
    })
    .select()
    .single();

  if (invoiceError) {
    console.error('Error saving invoice:', invoiceError);
    throw new Error('Failed to save invoice');
  }

  // Finally, save or update invoice items
  const invoiceItems = invoice.items.map(item => ({
    id: item.id || undefined,
    invoice_id: savedInvoice.id,
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

  const { error: itemsError } = await supabase
    .from('invoice_items')
    .upsert(invoiceItems);

  if (itemsError) {
    console.error('Error saving invoice items:', itemsError);
    throw new Error('Failed to save invoice items');
  }

  return savedInvoice.id;
}

export async function markInvoiceAsPaid(id: string): Promise<void> {
  const { error } = await supabase
    .from('invoices')
    .update({
      status: 'paid',
      paid_date: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) {
    console.error('Error marking invoice as paid:', error);
    throw new Error('Failed to mark invoice as paid');
  }
}

export async function deleteInvoice(id: string): Promise<void> {
  // First delete related invoice items
  const { error: itemsError } = await supabase
    .from('invoice_items')
    .delete()
    .eq('invoice_id', id);

  if (itemsError) {
    console.error('Error deleting invoice items:', itemsError);
    throw new Error('Failed to delete invoice items');
  }

  // Then delete the invoice
  const { error: invoiceError } = await supabase
    .from('invoices')
    .delete()
    .eq('id', id);

  if (invoiceError) {
    console.error('Error deleting invoice:', invoiceError);
    throw new Error('Failed to delete invoice');
  }
}
