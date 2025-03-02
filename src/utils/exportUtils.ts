
import { format } from 'date-fns';
import type { Invoice, ExportFilters } from '../types';

/**
 * Format a date to a standard string
 * @param date - Date to format
 * @returns Formatted date string
 */
export const formatDate = (date: Date) => {
  return format(date, 'dd/MM/yyyy');
};

/**
 * Convert invoice data to a format suitable for Excel export
 * @param invoices - Array of invoices
 * @returns Array suitable for Excel export
 */
export const formatInvoicesForExport = (invoices: Invoice[]) => {
  return invoices.map((invoice) => ({
    'Invoice Number': invoice.invoiceNumber,
    'Date': formatDate(invoice.date),
    'Due Date': invoice.dueDate ? formatDate(invoice.dueDate) : '',
    'Customer Name': invoice.customer.name,
    'Customer GST': invoice.customer.gstNo || '',
    'Items Count': invoice.items.length,
    'Subtotal': invoice.subtotal.toFixed(2),
    'CGST': invoice.cgstTotal.toFixed(2),
    'SGST': invoice.sgstTotal.toFixed(2),
    'Total Amount': invoice.grandTotal.toFixed(2),
    'Status': invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1),
    'Payment Method': invoice.paymentMethod || '',
    'Paid Amount': invoice.paidAmount?.toFixed(2) || '',
    'Paid Date': invoice.paidDate ? formatDate(invoice.paidDate) : '',
  }));
};

/**
 * Filter invoices based on specified criteria
 * @param invoices - Array of all invoices
 * @param filters - Filter criteria
 * @returns Filtered array of invoices
 */
export const filterInvoices = (
  invoices: Invoice[],
  filters: ExportFilters
) => {
  return invoices.filter((invoice) => {
    // Date range filter
    if (filters.startDate && new Date(invoice.date) < filters.startDate) {
      return false;
    }
    if (filters.endDate) {
      const endOfDay = new Date(filters.endDate);
      endOfDay.setHours(23, 59, 59, 999);
      if (new Date(invoice.date) > endOfDay) {
        return false;
      }
    }

    // Status filter
    if (filters.status && filters.status !== 'all' && invoice.status !== filters.status) {
      return false;
    }

    // Customer filter
    if (filters.customer && !invoice.customer.name.toLowerCase().includes(filters.customer.toLowerCase())) {
      return false;
    }

    return true;
  });
};

/**
 * Generate a CSV string from an array of objects
 * @param data - Array of objects to convert to CSV
 * @returns CSV string
 */
export const generateCSV = (data: any[]) => {
  if (data.length === 0) return '';

  const headers = Object.keys(data[0]);
  const csvRows = [];

  // Add the headers
  csvRows.push(headers.join(','));

  // Add the data
  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header] || '';
      // Escape quotes and wrap in quotes if the value contains commas or quotes
      return `"${String(value).replace(/"/g, '""')}"`;
    });
    csvRows.push(values.join(','));
  }

  return csvRows.join('\n');
};

/**
 * Download data as an Excel file
 * @param data - Data to download
 * @param fileName - Name of the file
 */
export const downloadExcel = (data: any[], fileName: string) => {
  const csv = generateCSV(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${fileName}.csv`);
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
