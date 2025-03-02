
export interface Customer {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  gstNo?: string;
}

export interface InvoiceItem {
  id: string;
  name: string;
  description?: string;
  hsnCode: string;
  quantity: number;
  weightInGrams?: number;
  ratePerGram?: number;
  price: number;
  makingCharges?: number;
  cgstRate: number;
  sgstRate: number;
  cgstAmount: number;
  sgstAmount: number;
  totalAmount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: Date;
  dueDate?: Date;
  customer: Customer;
  items: InvoiceItem[];
  subtotal: number;
  cgstTotal: number;
  sgstTotal: number;
  grandTotal: number;
  notes?: string;
  status: "draft" | "sent" | "paid" | "cancelled";
  paidAmount?: number;
  paidDate?: Date;
  paymentMethod?: string;
}

export interface VendorInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  gstNo: string;
  panNo?: string;
  bankDetails?: {
    accountName: string;
    accountNumber: string;
    bankName: string;
    ifscCode: string;
    branch: string;
  };
}

export interface ExportFilters {
  startDate: Date | null;
  endDate: Date | null;
  status?: "draft" | "sent" | "paid" | "cancelled" | "all";
  customer?: string;
}
