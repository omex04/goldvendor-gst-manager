
import { Invoice } from '@/types';
import { api } from '@/lib/api';

export async function fetchInvoices(): Promise<Invoice[]> {
  try {
    const invoices = await api.invoices.getAll();
    
    // Convert date strings to Date objects
    return invoices.map((invoice: any) => ({
      ...invoice,
      date: new Date(invoice.date),
      dueDate: invoice.dueDate ? new Date(invoice.dueDate) : undefined,
      paidDate: invoice.paidDate ? new Date(invoice.paidDate) : undefined,
    }));
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return [];
  }
}

export async function getInvoiceById(id: string): Promise<Invoice | null> {
  try {
    const invoice = await api.invoices.getById(id);
    
    // Convert date strings to Date objects
    return {
      ...invoice,
      date: new Date(invoice.date),
      dueDate: invoice.dueDate ? new Date(invoice.dueDate) : undefined,
      paidDate: invoice.paidDate ? new Date(invoice.paidDate) : undefined,
    };
  } catch (error) {
    console.error('Error fetching invoice:', error);
    return null;
  }
}

export async function saveInvoice(invoice: Invoice): Promise<string> {
  try {
    const result = await api.invoices.create(invoice);
    return result.id;
  } catch (error) {
    console.error('Error saving invoice:', error);
    throw new Error('Failed to save invoice');
  }
}

export async function markInvoiceAsPaid(id: string): Promise<void> {
  try {
    await api.invoices.markAsPaid(id);
  } catch (error) {
    console.error('Error marking invoice as paid:', error);
    throw new Error('Failed to mark invoice as paid');
  }
}

export async function deleteInvoice(id: string): Promise<void> {
  try {
    await api.invoices.delete(id);
  } catch (error) {
    console.error('Error deleting invoice:', error);
    throw new Error('Failed to delete invoice');
  }
}
