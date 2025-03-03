
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, DollarSign, FileText, TrendingUp } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchInvoices } from '@/services/invoiceService';

export function DashboardStats() {
  const { data: invoices = [] } = useQuery({
    queryKey: ['invoices'],
    queryFn: fetchInvoices,
  });
  
  // Calculate total revenue
  const totalRevenue = invoices.reduce((sum, invoice) => sum + invoice.grandTotal, 0);
  
  // Calculate total CGST
  const cgstTotal = invoices.reduce((sum, invoice) => sum + invoice.cgstTotal, 0);
  
  // Calculate total SGST
  const sgstTotal = invoices.reduce((sum, invoice) => sum + invoice.sgstTotal, 0);
  
  // Count invoices by status
  const paidInvoices = invoices.filter(invoice => invoice.status === 'paid').length;
  const pendingInvoices = invoices.filter(invoice => invoice.status === 'sent').length;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="card-hover">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
            <TrendingUp className="h-3 w-3 text-green-500" />
            <span className="text-green-500">+12.5%</span> from last month
          </p>
        </CardContent>
      </Card>
      
      <Card className="card-hover">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Invoices</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{invoices.length}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {pendingInvoices} pending, {paidInvoices} paid
          </p>
        </CardContent>
      </Card>
      
      <Card className="card-hover">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">CGST Collected</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{cgstTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
          <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
        </CardContent>
      </Card>
      
      <Card className="card-hover">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">SGST Collected</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{sgstTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
          <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
        </CardContent>
      </Card>
    </div>
  );
}

export default DashboardStats;
