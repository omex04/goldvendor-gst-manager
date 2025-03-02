
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/utils/exportUtils';
import { Link } from 'react-router-dom';

const DUMMY_INVOICES = [
  {
    id: '1',
    invoiceNumber: 'INV-001',
    date: new Date('2023-05-10'),
    customer: { name: 'Rajesh Sharma', email: 'rajesh@example.com' },
    grandTotal: 24500,
    status: 'paid',
  },
  {
    id: '2',
    invoiceNumber: 'INV-002',
    date: new Date('2023-05-12'),
    customer: { name: 'Priya Patel', email: 'priya@example.com' },
    grandTotal: 18750,
    status: 'paid',
  },
  {
    id: '3',
    invoiceNumber: 'INV-003',
    date: new Date('2023-05-15'),
    customer: { name: 'Amit Desai', email: 'amit@example.com' },
    grandTotal: 32100,
    status: 'pending',
  },
  {
    id: '4',
    invoiceNumber: 'INV-004',
    date: new Date('2023-05-18'),
    customer: { name: 'Sanjay Mehta', email: 'sanjay@example.com' },
    grandTotal: 15000,
    status: 'pending',
  },
];

export function RecentInvoices() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-lg font-medium">Recent Invoices</CardTitle>
        <Button variant="outline" size="sm" asChild>
          <Link to="/invoice-history">View all</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {DUMMY_INVOICES.map((invoice) => (
            <div key={invoice.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-md">
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-primary/20">
                    {invoice.customer.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{invoice.customer.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {invoice.invoiceNumber} • {formatDate(invoice.date)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-sm font-medium text-right">
                  ₹{invoice.grandTotal.toLocaleString('en-IN')}
                  <p className="text-xs text-muted-foreground capitalize">{invoice.status}</p>
                </div>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
                  <Link to={`/view-invoice/${invoice.id}`}>
                    <span className="sr-only">View</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default RecentInvoices;
