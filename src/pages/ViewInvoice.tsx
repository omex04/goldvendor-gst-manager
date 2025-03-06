
import React, { useRef } from 'react';
import { PageTransition } from '@/components/ui/PageTransition';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { ArrowLeft, Download, Printer, Trash2 } from 'lucide-react';
import { formatDate } from '@/utils/exportUtils';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getInvoiceById, markInvoiceAsPaid, deleteInvoice } from '@/services/invoiceService';
import { toast } from 'sonner';
import { useReactToPrint } from 'react-to-print';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { useSettings } from '@/context/SettingsContext';

const statusColors = {
  draft: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  sent: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  paid: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

const ViewInvoice = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const { settings } = useSettings();
  
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

  // Mutation for deleting an invoice
  const deleteInvoiceMutation = useMutation({
    mutationFn: deleteInvoice,
    onSuccess: () => {
      toast.success('Invoice deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      navigate('/invoice-history');
    },
    onError: (error) => {
      toast.error('Failed to delete invoice');
      console.error(error);
    },
  });

  // Handle print functionality - fixed the API usage for useReactToPrint
  const handlePrint = useReactToPrint({
    documentTitle: `Invoice-${invoice?.invoiceNumber || 'unknown'}`,
    onAfterPrint: () => toast.success('Invoice printed successfully'),
    // Use contentRef instead of content function
    contentRef: invoiceRef,
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

  // Handle delete invoice
  const handleDeleteInvoice = () => {
    if (!id) return;
    deleteInvoiceMutation.mutate(id);
  };

  if (isLoading) {
    return (
      <MainLayout>
        <PageTransition>
          <div className="flex justify-center items-center h-64">
            <p className="dark:text-gray-400">Loading invoice...</p>
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
              <p className="text-muted-foreground mb-4 dark:text-gray-400">Failed to load invoice</p>
              <Button variant="outline" asChild className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
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
              <Button variant="outline" size="icon" asChild className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <Link to="/invoice-history">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <h1 className="text-2xl font-bold tracking-tight dark:text-white">Invoice #{invoice.invoiceNumber}</h1>
              <Badge 
                variant="outline" 
                className={`${statusColors[invoice.status as keyof typeof statusColors]} border-none font-normal capitalize`}
              >
                {invoice.status}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={printInvoice} 
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleDownloadPDF}
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              {invoice.status !== 'paid' && (
                <Button 
                  className="bg-gold-500 hover:bg-gold-600 text-primary-foreground dark:bg-gold-600 dark:hover:bg-gold-700"
                  onClick={handleMarkAsPaid}
                  disabled={markAsPaidMutation.isPending}
                >
                  Mark as Paid
                </Button>
              )}
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={() => setDeleteDialogOpen(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
          
          {/* Vendor information banner */}
          <div className="bg-gold-50 dark:bg-gray-800 p-4 rounded-lg border border-gold-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gold-800 dark:text-gold-400">Vendor Information</h2>
            <p className="text-sm text-gold-700 dark:text-gray-300">
              {settings.vendor.name} | GSTIN: {settings.vendor.gstNo} | {settings.vendor.address}
            </p>
          </div>
          
          <Card className="border-0 shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="p-6" ref={invoiceRef}>
              <div className="text-center border-b pb-4 mb-6 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gold-700 dark:text-gold-400">{settings.vendor.name}</h2>
                <p className="text-sm dark:text-gray-300">{settings.vendor.address}</p>
                <p className="text-sm dark:text-gray-300">Phone: {settings.vendor.phone} | Email: {settings.vendor.email}</p>
                <p className="text-sm dark:text-gray-300">GST No: {settings.vendor.gstNo}</p>
                {settings.vendor.panNo && <p className="text-sm dark:text-gray-300">PAN: {settings.vendor.panNo}</p>}
              </div>
              
              <div className="flex flex-col md:flex-row justify-between pb-8 border-b dark:border-gray-700">
                <div>
                  <h2 className="text-3xl font-bold text-gold-700 dark:text-gold-400">INVOICE</h2>
                  <div className="mt-1 flex items-center">
                    <span className="text-muted-foreground mr-2 dark:text-gray-400">#:</span>
                    <span className="font-medium dark:text-gray-300">{invoice.invoiceNumber}</span>
                  </div>
                </div>
                
                <div className="mt-4 md:mt-0 md:text-right">
                  <div className="text-sm">
                    <span className="text-muted-foreground dark:text-gray-400">Date: </span>
                    <span className="dark:text-gray-300">{formatDate(invoice.date)}</span>
                  </div>
                  {invoice.dueDate && (
                    <div className="text-sm">
                      <span className="text-muted-foreground dark:text-gray-400">Due Date: </span>
                      <span className="dark:text-gray-300">{formatDate(invoice.dueDate)}</span>
                    </div>
                  )}
                  {invoice.paymentMethod && (
                    <div className="text-sm">
                      <span className="text-muted-foreground dark:text-gray-400">Payment Method: </span>
                      <span className="dark:text-gray-300">{invoice.paymentMethod}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-8 border-b dark:border-gray-700">
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-3 dark:text-gray-400">FROM</h3>
                  <div className="space-y-1 dark:text-gray-300">
                    <p className="font-bold">{settings.vendor.name}</p>
                    <p>{settings.vendor.address}</p>
                    <p>Phone: {settings.vendor.phone}</p>
                    <p>Email: {settings.vendor.email}</p>
                    <p>GSTIN: {settings.vendor.gstNo}</p>
                    {settings.vendor.panNo && <p>PAN: {settings.vendor.panNo}</p>}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-3 dark:text-gray-400">TO</h3>
                  <div className="space-y-1 dark:text-gray-300">
                    <p className="font-bold">{invoice.customer.name}</p>
                    <p>{invoice.customer.address}</p>
                    <p>Phone: {invoice.customer.phone}</p>
                    {invoice.customer.email && <p>Email: {invoice.customer.email}</p>}
                    {invoice.customer.gstNo && <p>GSTIN: {invoice.customer.gstNo}</p>}
                  </div>
                </div>
              </div>
              
              <div className="py-8 border-b dark:border-gray-700">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b dark:border-gray-700">
                      <th className="py-3 px-4 text-left font-medium dark:text-gray-300">Item</th>
                      <th className="py-3 px-4 text-left font-medium dark:text-gray-300">HSN</th>
                      <th className="py-3 px-4 text-right font-medium dark:text-gray-300">Weight (g)</th>
                      <th className="py-3 px-4 text-right font-medium dark:text-gray-300">Rate/g (₹)</th>
                      <th className="py-3 px-4 text-right font-medium dark:text-gray-300">Making (₹)</th>
                      <th className="py-3 px-4 text-right font-medium dark:text-gray-300">Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items.map((item) => (
                      <tr key={item.id} className="border-b last:border-0 dark:border-gray-700">
                        <td className="py-4 px-4 dark:text-gray-300">
                          <div className="font-medium">{item.name}</div>
                          {item.description && (
                            <div className="text-xs text-muted-foreground dark:text-gray-400">{item.description}</div>
                          )}
                        </td>
                        <td className="py-4 px-4 dark:text-gray-300">{item.hsnCode}</td>
                        <td className="py-4 px-4 text-right dark:text-gray-300">{item.weightInGrams}</td>
                        <td className="py-4 px-4 text-right dark:text-gray-300">
                          {item.ratePerGram !== undefined
                            ? item.ratePerGram.toLocaleString('en-IN')
                            : '-'}
                        </td>
                        <td className="py-4 px-4 text-right dark:text-gray-300">
                          {item.makingCharges !== undefined
                            ? item.makingCharges.toLocaleString('en-IN')
                            : '-'}
                        </td>
                        <td className="py-4 px-4 text-right font-medium dark:text-gray-300">
                          {item.price.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="py-8 grid grid-cols-1 md:grid-cols-2">
                <div>
                  <h3 className="font-medium mb-3 dark:text-gray-300">Notes</h3>
                  <p className="text-sm text-muted-foreground dark:text-gray-400">{invoice.notes || 'No notes'}</p>
                  
                  {settings.bank.accountNumber && (
                    <div className="mt-6">
                      <h3 className="font-medium mb-3 dark:text-gray-300">Bank Details</h3>
                      <div className="text-sm dark:text-gray-400">
                        <p>Account Name: {settings.bank.accountName}</p>
                        <p>Account Number: {settings.bank.accountNumber}</p>
                        <p>Bank: {settings.bank.bankName}</p>
                        <p>IFSC: {settings.bank.ifscCode}</p>
                        <p>Branch: {settings.bank.branch}</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="mt-6 md:mt-0 md:ml-auto md:w-72">
                  <div className="space-y-2">
                    <div className="flex justify-between dark:text-gray-300">
                      <span className="text-muted-foreground dark:text-gray-400">Subtotal:</span>
                      <span>₹{invoice.subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between dark:text-gray-300">
                      <span className="text-muted-foreground dark:text-gray-400">CGST ({settings.gst.cgstRate}%):</span>
                      <span>₹{invoice.cgstTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between dark:text-gray-300">
                      <span className="text-muted-foreground dark:text-gray-400">SGST ({settings.gst.sgstRate}%):</span>
                      <span>₹{invoice.sgstTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <Separator className="my-2 dark:bg-gray-700" />
                    <div className="flex justify-between font-bold text-lg dark:text-gray-300">
                      <span>Total:</span>
                      <span>₹{invoice.grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                    {invoice.paidAmount && (
                      <div className="flex justify-between text-green-600 dark:text-green-400">
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

      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="dark:bg-gray-800 dark:border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="dark:text-white">Are you sure you want to delete this invoice?</AlertDialogTitle>
            <AlertDialogDescription className="dark:text-gray-400">
              This action cannot be undone. This will permanently delete the invoice and all its data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteInvoice}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
};

export default ViewInvoice;
