
import React, { useRef } from 'react';
import { PageTransition } from '@/components/ui/PageTransition';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getInvoiceById } from '@/services/invoiceService';
import { format } from 'date-fns';
import { ChevronLeft, Download, Printer, Send } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { InvoiceExport } from '@/components/invoices/InvoiceExport';

const ViewInvoice = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const invoiceRef = useRef<HTMLDivElement>(null);
  
  const { data: invoice, isLoading, error } = useQuery({
    queryKey: ['invoice', id],
    queryFn: () => getInvoiceById(id as string),
    enabled: !!id,
  });
  
  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </MainLayout>
    );
  }
  
  if (error || !invoice) {
    return (
      <MainLayout>
        <div className="text-center py-10">
          <h2 className="text-2xl font-bold mb-4">Invoice Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The invoice you're looking for doesn't exist or has been deleted.
          </p>
          <Button onClick={() => navigate('/invoice-history')}>
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Invoices
          </Button>
        </div>
      </MainLayout>
    );
  }
  
  const handlePrint = useReactToPrint({
    documentTitle: `Invoice-${invoice?.invoiceNumber || 'unknown'}`,
    onAfterPrint: () => toast.success('Invoice printed successfully'),
    contentRef: invoiceRef,
  });

  const printInvoice = () => {
    if (invoiceRef.current) {
      handlePrint();
    }
  };

  const subtotal = invoice.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const cgstTotal = subtotal * 0.09; // Assuming 9% CGST
  const sgstTotal = subtotal * 0.09; // Assuming 9% SGST
  const grandTotal = subtotal + cgstTotal + sgstTotal;

  return (
    <MainLayout>
      <div ref={invoiceRef} className="p-6">
        <Card>
          <CardContent>
            <h1 className="text-2xl font-bold mb-4">Invoice #{invoice.invoiceNumber}</h1>
            <p className="text-sm text-muted-foreground mb-2">Date: {format(new Date(invoice.date), 'dd/MM/yyyy')}</p>
            <p className="text-sm text-muted-foreground mb-2">Due Date: {format(new Date(invoice.dueDate), 'dd/MM/yyyy')}</p>
            <div className="mb-4">
              <h2 className="text-lg font-semibold">Customer Details</h2>
              <p>{invoice.customer.name}</p>
              <p>{invoice.customer.address}</p>
              <p>{invoice.customer.phone}</p>
              <p>{invoice.customer.email}</p>
              <p>{invoice.customer.gstNo}</p>
            </div>
            <h2 className="text-lg font-semibold mb-2">Items</h2>
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border p-2">Item</th>
                  <th className="border p-2">Quantity</th>
                  <th className="border p-2">Price</th>
                  <th className="border p-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, index) => (
                  <tr key={index}>
                    <td className="border p-2">{item.name}</td>
                    <td className="border p-2">{item.quantity}</td>
                    <td className="border p-2">₹{item.price.toFixed(2)}</td>
                    <td className="border p-2">₹{(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4">
              <h2 className="text-lg font-semibold">Summary</h2>
              <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
              <p>CGST: ₹{cgstTotal.toFixed(2)}</p>
              <p>SGST: ₹{sgstTotal.toFixed(2)}</p>
              <p className="font-bold">Grand Total: ₹{grandTotal.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>
        <div className="flex justify-end mt-4">
          <Button onClick={printInvoice} className="mr-2">
            <Printer className="mr-2" /> Print
          </Button>
          <Button>
            <Download className="mr-2" /> Download
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default ViewInvoice;
