
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
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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

  const downloadInvoice = async () => {
    if (!invoiceRef.current) return;
    
    try {
      toast.info('Preparing invoice for download...');
      
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2,
        logging: false,
        useCORS: true
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`Invoice-${invoice.invoiceNumber}.pdf`);
      
      toast.success('Invoice downloaded successfully');
    } catch (err) {
      console.error('Error generating PDF:', err);
      toast.error('Failed to download invoice');
    }
  };

  const subtotal = invoice.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const cgstTotal = subtotal * 0.09; // Assuming 9% CGST
  const sgstTotal = subtotal * 0.09; // Assuming 9% SGST
  const grandTotal = subtotal + cgstTotal + sgstTotal;

  return (
    <MainLayout>
      <div className="p-6">
        <div ref={invoiceRef} className="bg-white p-6 rounded-lg shadow-sm mb-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h1 className="text-2xl font-bold mb-1">Invoice #{invoice.invoiceNumber}</h1>
                  <p className="text-sm text-muted-foreground">Date: {format(new Date(invoice.date), 'dd/MM/yyyy')}</p>
                  <p className="text-sm text-muted-foreground">Due Date: {format(new Date(invoice.dueDate), 'dd/MM/yyyy')}</p>
                </div>
                <div className="text-right">
                  <h2 className="text-lg font-semibold">Gold GST Manager</h2>
                  <p className="text-sm">123 Jewelry Lane</p>
                  <p className="text-sm">Mumbai, Maharashtra 400001</p>
                  <p className="text-sm">GSTIN: 27AADCJ1234R1Z5</p>
                </div>
              </div>
              
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-2">Billed To:</h2>
                <p className="font-medium">{invoice.customer.name}</p>
                <p>{invoice.customer.address}</p>
                <p>Phone: {invoice.customer.phone}</p>
                <p>Email: {invoice.customer.email}</p>
                {invoice.customer.gstNo && <p>GSTIN: {invoice.customer.gstNo}</p>}
              </div>
              
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Items</h2>
                <table className="w-full border-collapse mb-4">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="border p-2 text-left">Item</th>
                      <th className="border p-2 text-right">Quantity</th>
                      <th className="border p-2 text-right">Rate</th>
                      <th className="border p-2 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items.map((item, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                        <td className="border p-2">{item.name}</td>
                        <td className="border p-2 text-right">{item.quantity}</td>
                        <td className="border p-2 text-right">₹{item.price.toFixed(2)}</td>
                        <td className="border p-2 text-right">₹{(item.price * item.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="flex justify-end">
                <div className="w-64">
                  <div className="flex justify-between py-2">
                    <span className="font-medium">Subtotal:</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="font-medium">CGST (9%):</span>
                    <span>₹{cgstTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="font-medium">SGST (9%):</span>
                    <span>₹{sgstTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-t font-bold">
                    <span>Grand Total:</span>
                    <span>₹{grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              {invoice.notes && (
                <div className="mt-6 pt-6 border-t">
                  <h2 className="text-md font-semibold mb-2">Notes:</h2>
                  <p className="text-sm text-muted-foreground">{invoice.notes}</p>
                </div>
              )}
              
              <div className="mt-8 pt-6 border-t text-center text-sm text-muted-foreground">
                <p>Thank you for your business!</p>
                <p>Payment Method: {invoice.paymentMethod || 'Cash/UPI/Bank Transfer'}</p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex justify-end mt-4">
          <Button onClick={() => navigate('/invoice-history')} variant="outline" className="mr-2">
            <ChevronLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <Button onClick={printInvoice} variant="outline" className="mr-2">
            <Printer className="mr-2 h-4 w-4" /> Print
          </Button>
          <Button onClick={downloadInvoice}>
            <Download className="mr-2 h-4 w-4" /> Download
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default ViewInvoice;
