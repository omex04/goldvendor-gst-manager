
import React, { useRef } from 'react';
import { PageTransition } from '@/components/ui/PageTransition';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Printer } from 'lucide-react';
import { formatDate } from '@/utils/exportUtils';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getInvoiceById, markInvoiceAsPaid } from '@/services/invoiceService';
import { toast } from 'sonner';
import { useReactToPrint } from 'react-to-print';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const statusColors = {
  draft: "bg-gray-100 text-gray-800",
  pending: "bg-yellow-100 text-yellow-800",
  sent: "bg-yellow-100 text-yellow-800",
  paid: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const ViewInvoice = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const invoiceRef = useRef<HTMLDivElement>(null);
  
  const { data: invoice, isLoading, error } = useQuery({
    queryKey: ['invoice', id],
    queryFn: () => getInvoiceById(id || ''),
    enabled: !!id,
  });

  // Mutation for marking invoice as paid
  const markAsPaidMutation = useMutation({
    mutationFn: markInvoiceAsPaid,
    onSuccess: () => {
      toast.success('Invoice marked as paid');
      queryClient.invalidateQueries({ queryKey: ['invoice', id] });
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
    onError: (error) => {
      toast.error('Failed to mark invoice as paid');
      console.error(error);
    },
  });

  // Handle print functionality
  const handlePrint = useReactToPrint({
    documentTitle: `Invoice-${invoice?.invoiceNumber || 'unknown'}`,
    onAfterPrint: () => toast.success('Invoice printed successfully'),
  });

  // Wrapper function to use with the button's onClick
  const printInvoice = () => {
    if (invoiceRef.current) {
      handlePrint();
    }
  };

  // Handle download PDF functionality
  const handleDownloadPDF = async () => {
    if (!invoiceRef.current) return;

    try {
      toast.loading('Generating PDF...');
      
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      });
      
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`Invoice-${invoice?.invoiceNumber || 'unknown'}.pdf`);
      
      toast.dismiss();
      toast.success('PDF downloaded successfully');
    } catch (error) {
      toast.dismiss();
      toast.error('Failed to generate PDF');
      console.error(error);
    }
  };

  // Handle mark as paid
  const handleMarkAsPaid = () => {
    if (!id) return;
    markAsPaidMutation.mutate(id);
  };

  if (isLoading) {
    return (
      <MainLayout>
        <PageTransition>
          <div className="flex justify-center items-center h-64">
            <p>Loading invoice...</p>
          </div>
        </PageTransition>
      </MainLayout>
    );
  }

  if (error || !invoice) {
    return (
      <MainLayout>
        <PageTransition>
          <div className="space-y-6">
            <div className="flex flex-col items-center justify-center h-64">
              <p className="text-muted-foreground mb-4">Failed to load invoice</p>
              <Button variant="outline" asChild>
                <Link to="/invoice-history">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Invoices
                </Link>
              </Button>
            </div>
          </div>
        </PageTransition>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <PageTransition>
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" asChild>
                <Link to="/invoice-history">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <h1 className="text-2xl font-bold tracking-tight">Invoice #{invoice.invoiceNumber}</h1>
              <Badge 
                variant="outline" 
                className={`${statusColors[invoice.status as keyof typeof statusColors]} border-none font-normal capitalize`}
              >
                {invoice.status}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={printInvoice}>
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownloadPDF}>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              {invoice.status !== 'paid' && (
                <Button 
                  className="bg-gold-500 hover:bg-gold-600"
                  onClick={handleMarkAsPaid}
                  disabled={markAsPaidMutation.isPending}
                >
                  Mark as Paid
                </Button>
              )}
            </div>
          </div>
          
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6" ref={invoiceRef}>
              <div className="flex flex-col md:flex-row justify-between pb-8 border-b">
                <div>
                  <h2 className="text-3xl font-bold text-gold-700">INVOICE</h2>
                  <div className="mt-1 flex items-center">
                    <span className="text-muted-foreground mr-2">#:</span>
                    <span className="font-medium">{invoice.invoiceNumber}</span>
                  </div>
                </div>
                
                <div className="mt-4 md:mt-0 md:text-right">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Date: </span>
                    <span>{formatDate(invoice.date)}</span>
                  </div>
                  {invoice.dueDate && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Due Date: </span>
                      <span>{formatDate(invoice.dueDate)}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-8 border-b">
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-3">FROM</h3>
                  <div className="space-y-1">
                    <p className="font-bold">Gold Jewelry Shop</p>
                    <p>123 Jewelers Lane, Mumbai, Maharashtra 400001</p>
                    <p>Phone: +91 98765 12345</p>
                    <p>Email: contact@goldjewelry.com</p>
                    <p>GSTIN: 27AADCG1234A1Z5</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-3">TO</h3>
                  <div className="space-y-1">
                    <p className="font-bold">{invoice.customer.name}</p>
                    <p>{invoice.customer.address}</p>
                    <p>Phone: {invoice.customer.phone}</p>
                    {invoice.customer.email && <p>Email: {invoice.customer.email}</p>}
                    {invoice.customer.gstNo && <p>GSTIN: {invoice.customer.gstNo}</p>}
                  </div>
                </div>
              </div>
              
              <div className="py-8 border-b">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="py-3 px-4 text-left font-medium">Item</th>
                      <th className="py-3 px-4 text-left font-medium">HSN</th>
                      <th className="py-3 px-4 text-right font-medium">Weight (g)</th>
                      <th className="py-3 px-4 text-right font-medium">Rate/g (₹)</th>
                      <th className="py-3 px-4 text-right font-medium">Making (₹)</th>
                      <th className="py-3 px-4 text-right font-medium">Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items.map((item) => (
                      <tr key={item.id} className="border-b last:border-0">
                        <td className="py-4 px-4">
                          <div className="font-medium">{item.name}</div>
                          {item.description && (
                            <div className="text-xs text-muted-foreground">{item.description}</div>
                          )}
                        </td>
                        <td className="py-4 px-4">{item.hsnCode}</td>
                        <td className="py-4 px-4 text-right">{item.weightInGrams}</td>
                        <td className="py-4 px-4 text-right">
                          {item.ratePerGram !== undefined
                            ? item.ratePerGram.toLocaleString('en-IN')
                            : '-'}
                        </td>
                        <td className="py-4 px-4 text-right">
                          {item.makingCharges !== undefined
                            ? item.makingCharges.toLocaleString('en-IN')
                            : '-'}
                        </td>
                        <td className="py-4 px-4 text-right font-medium">
                          {item.price.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="py-8 grid grid-cols-1 md:grid-cols-2">
                <div>
                  <h3 className="font-medium mb-3">Notes</h3>
                  <p className="text-sm text-muted-foreground">{invoice.notes || 'No notes'}</p>
                </div>
                
                <div className="mt-6 md:mt-0 md:ml-auto md:w-72">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal:</span>
                      <span>₹{invoice.subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">CGST (1.5%):</span>
                      <span>₹{invoice.cgstTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">SGST (1.5%):</span>
                      <span>₹{invoice.sgstTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span>₹{invoice.grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                    {invoice.paidAmount && (
                      <div className="flex justify-between text-green-600">
                        <span>Paid:</span>
                        <span>₹{invoice.paidAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageTransition>
    </MainLayout>
  );
};

export default ViewInvoice;
