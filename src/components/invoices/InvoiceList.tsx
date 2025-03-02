
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, ChevronDownIcon, FileText, Search } from 'lucide-react';
import { format } from 'date-fns';
import { formatDate } from '@/utils/exportUtils';
import InvoiceExport from './InvoiceExport';
import { Invoice, InvoiceItem } from '@/types';
import { DateRange } from 'react-day-picker';

// Dummy data with proper types matching Invoice interface
const INVOICES: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'INV-001',
    date: new Date('2023-05-10'),
    customer: { name: 'Rajesh Sharma', id: '1', gstNo: '27AABCU9603R1ZX', address: '123 Mumbai Road', phone: '9876543210', email: 'rajesh@example.com' },
    items: [{ id: '1', name: 'Gold Ring', hsnCode: '7113', quantity: 1, price: 22000, cgstRate: 1.5, sgstRate: 1.5, cgstAmount: 330, sgstAmount: 330, totalAmount: 22660 }],
    subtotal: 22000,
    cgstTotal: 330,
    sgstTotal: 330,
    grandTotal: 22660,
    status: "paid",
  },
  {
    id: '2',
    invoiceNumber: 'INV-002',
    date: new Date('2023-05-12'),
    customer: { name: 'Priya Patel', id: '2', gstNo: '27AADCP8189M1ZS', address: '456 Pune Street', phone: '9876543211', email: 'priya@example.com' },
    items: [{ id: '1', name: 'Gold Necklace', hsnCode: '7113', quantity: 1, price: 18000, cgstRate: 1.5, sgstRate: 1.5, cgstAmount: 270, sgstAmount: 270, totalAmount: 18540 }],
    subtotal: 18000,
    cgstTotal: 270,
    sgstTotal: 270,
    grandTotal: 18540,
    status: "paid",
  },
  {
    id: '3',
    invoiceNumber: 'INV-003',
    date: new Date('2023-05-15'),
    customer: { name: 'Amit Desai', id: '3', gstNo: '27AAKFD2194N1ZT', address: '789 Nagpur Avenue', phone: '9876543212', email: 'amit@example.com' },
    items: [{ id: '1', name: 'Gold Bangle', hsnCode: '7113', quantity: 1, price: 30000, cgstRate: 1.5, sgstRate: 1.5, cgstAmount: 450, sgstAmount: 450, totalAmount: 30900 }],
    subtotal: 30000,
    cgstTotal: 450,
    sgstTotal: 450,
    grandTotal: 30900,
    status: "draft",
  },
  {
    id: '4',
    invoiceNumber: 'INV-004',
    date: new Date('2023-05-18'),
    customer: { name: 'Sanjay Mehta', id: '4', gstNo: '27AAJCS8349P1ZU', address: '101 Thane Road', phone: '9876543213', email: 'sanjay@example.com' },
    items: [{ id: '1', name: 'Gold Earrings', hsnCode: '7113', quantity: 1, price: 15000, cgstRate: 1.5, sgstRate: 1.5, cgstAmount: 225, sgstAmount: 225, totalAmount: 15450 }],
    subtotal: 15000,
    cgstTotal: 225,
    sgstTotal: 225,
    grandTotal: 15450,
    status: "sent",
  },
  {
    id: '5',
    invoiceNumber: 'INV-005',
    date: new Date('2023-05-20'),
    customer: { name: 'Neha Kapoor', id: '5', gstNo: '27AADCN5639Q1ZV', address: '202 Nashik Street', phone: '9876543214', email: 'neha@example.com' },
    items: [{ id: '1', name: 'Gold Chain', hsnCode: '7113', quantity: 1, price: 42000, cgstRate: 1.5, sgstRate: 1.5, cgstAmount: 630, sgstAmount: 630, totalAmount: 43260 }],
    subtotal: 42000,
    cgstTotal: 630,
    sgstTotal: 630,
    grandTotal: 43260,
    status: "paid",
  },
  {
    id: '6',
    invoiceNumber: 'INV-006',
    date: new Date('2023-05-25'),
    customer: { name: 'Vikram Singh', id: '6', gstNo: '27ABFCS2589R1ZW', address: '303 Aurangabad Lane', phone: '9876543215', email: 'vikram@example.com' },
    items: [{ id: '1', name: 'Gold Bracelet', hsnCode: '7113', quantity: 1, price: 38500, cgstRate: 1.5, sgstRate: 1.5, cgstAmount: 577.5, sgstAmount: 577.5, totalAmount: 39655 }],
    subtotal: 38500,
    cgstTotal: 577.5,
    sgstTotal: 577.5,
    grandTotal: 39655,
    status: "sent",
  },
];

const statusColors = {
  draft: "bg-gray-100 text-gray-800",
  pending: "bg-yellow-100 text-yellow-800", 
  sent: "bg-yellow-100 text-yellow-800",
  paid: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export function InvoiceList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });
  
  // Filter invoices based on search term, status, and date range
  const filteredInvoices = INVOICES.filter((invoice) => {
    // Check search term
    const searchMatch = 
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (invoice.customer.gstNo && invoice.customer.gstNo.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Check status filter
    const statusMatch = statusFilter === 'all' || invoice.status === statusFilter;
    
    // Check date range
    let dateMatch = true;
    if (dateRange.from) {
      dateMatch = dateMatch && invoice.date >= dateRange.from;
    }
    if (dateRange.to) {
      const toDate = new Date(dateRange.to);
      toDate.setHours(23, 59, 59, 999);
      dateMatch = dateMatch && invoice.date <= toDate;
    }
    
    return searchMatch && statusMatch && dateMatch;
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>Invoices</CardTitle>
            <CardDescription>
              Manage and track all your invoices
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" asChild>
              <Link to="/create-invoice">
                <FileText className="mr-2 h-4 w-4" />
                New Invoice
              </Link>
            </Button>
            <InvoiceExport invoices={filteredInvoices} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search invoices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <div className="flex flex-col md:flex-row gap-4">
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className="w-full md:w-[240px] justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} -{" "}
                        {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        <div className="rounded-md border">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="py-3 px-4 text-left font-medium">Invoice</th>
                  <th className="py-3 px-4 text-left font-medium">Date</th>
                  <th className="py-3 px-4 text-left font-medium">Customer</th>
                  <th className="py-3 px-4 text-left font-medium">Amount</th>
                  <th className="py-3 px-4 text-left font-medium">Status</th>
                  <th className="py-3 px-4 text-left font-medium sr-only">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-muted-foreground">
                      No invoices found matching your filters
                    </td>
                  </tr>
                ) : (
                  filteredInvoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b transition-colors hover:bg-muted/50">
                      <td className="py-3 px-4">
                        <Link to={`/view-invoice/${invoice.id}`} className="font-medium text-blue-600 hover:underline">
                          {invoice.invoiceNumber}
                        </Link>
                      </td>
                      <td className="py-3 px-4">{formatDate(invoice.date)}</td>
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium">{invoice.customer.name}</div>
                          <div className="text-xs text-muted-foreground">{invoice.customer.gstNo}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium">
                        ₹{invoice.grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-4">
                        <Badge 
                          variant="outline" 
                          className={`${statusColors[invoice.status as keyof typeof statusColors]} border-none font-normal capitalize`}
                        >
                          {invoice.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Button variant="ghost" size="icon" asChild>
                          <Link to={`/view-invoice/${invoice.id}`}>
                            <span className="sr-only">View</span>
                            <ChevronDownIcon className="h-4 w-4" />
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default InvoiceList;
