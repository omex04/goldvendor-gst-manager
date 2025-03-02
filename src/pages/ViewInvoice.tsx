
import React from 'react';
import { PageTransition } from '@/components/ui/PageTransition';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, Printer } from 'lucide-react';
import { formatDate } from '@/utils/exportUtils';

// Dummy invoice data (in a real app, this would come from a database)
const INVOICE = {
  id: '3',
  invoiceNumber: 'INV-003',
  date: new Date('2023-05-15'),
  dueDate: new Date('2023-05-29'),
  status: 'draft',
  customer: {
    name: 'Amit Desai',
    address: '456 Diamond Street, Pune, Maharashtra 411001',
    phone: '+91 98765 43210',
    email: 'amit.desai@example.com',
    gstNo: '27AAKFD2194N1ZT',
  },
  vendor: {
    name: 'Gold Jewelry Shop',
    address: '123 Jewelers Lane, Mumbai, Maharashtra 400001',
    phone: '+91 98765 12345',
    email: 'contact@goldjewelry.com',
    gstNo: '27AADCG1234A1Z5',
  },
  items: [
    {
      id: '1',
      name: 'Gold Chain',
      description: '22K Gold Chain',
      hsnCode: '7113',
      quantity: 1,
      weightInGrams: 15,
      ratePerGram: 5500,
      price: 82500,
      makingCharges: 5000,
      cgstRate: 1.5,
      sgstRate: 1.5,
      cgstAmount: 1237.5,
      sgstAmount: 1237.5,
      totalAmount: 84975,
    },
    {
      id: '2',
      name: 'Gold Earrings',
      description: '22K Gold Earrings with Ruby',
      hsnCode: '7113',
      quantity: 1,
      weightInGrams: 8,
      ratePerGram: 5500,
      price: 44000,
      makingCharges: 3000,
      cgstRate: 1.5,
      sgstRate: 1.5,
      cgstAmount: 660,
      sgstAmount: 660,
      totalAmount: 45320,
    },
  ],
  subtotal: 126500,
  cgstTotal: 1897.5,
  sgstTotal: 1897.5,
  grandTotal: 130295,
  notes: 'Thank you for your business. All jewelry items come with a certificate of authenticity.',
};

const statusColors = {
  draft: "bg-gray-100 text-gray-800",
  pending: "bg-yellow-100 text-yellow-800",
  paid: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const ViewInvoice = () => {
  const { id } = useParams();
  
  // In a real app, we would fetch the invoice data based on the ID
  // For now, we'll just use the dummy data
  
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
              <h1 className="text-2xl font-bold tracking-tight">Invoice #{INVOICE.invoiceNumber}</h1>
              <Badge 
                variant="outline" 
                className={`${statusColors[INVOICE.status as keyof typeof statusColors]} border-none font-normal capitalize`}
              >
                {INVOICE.status}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              <Button className="bg-gold-500 hover:bg-gold-600">
                Mark as Paid
              </Button>
            </div>
          </div>
          
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between pb-8 border-b">
                <div>
                  <h2 className="text-3xl font-bold text-gold-700">INVOICE</h2>
                  <div className="mt-1 flex items-center">
                    <span className="text-muted-foreground mr-2">#:</span>
                    <span className="font-medium">{INVOICE.invoiceNumber}</span>
                  </div>
                </div>
                
                <div className="mt-4 md:mt-0 md:text-right">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Date: </span>
                    <span>{formatDate(INVOICE.date)}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Due Date: </span>
                    <span>{formatDate(INVOICE.dueDate)}</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-8 border-b">
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-3">FROM</h3>
                  <div className="space-y-1">
                    <p className="font-bold">{INVOICE.vendor.name}</p>
                    <p>{INVOICE.vendor.address}</p>
                    <p>Phone: {INVOICE.vendor.phone}</p>
                    <p>Email: {INVOICE.vendor.email}</p>
                    <p>GSTIN: {INVOICE.vendor.gstNo}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-3">TO</h3>
                  <div className="space-y-1">
                    <p className="font-bold">{INVOICE.customer.name}</p>
                    <p>{INVOICE.customer.address}</p>
                    <p>Phone: {INVOICE.customer.phone}</p>
                    <p>Email: {INVOICE.customer.email}</p>
                    <p>GSTIN: {INVOICE.customer.gstNo}</p>
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
                    {INVOICE.items.map((item) => (
                      <tr key={item.id} className="border-b last:border-0">
                        <td className="py-4 px-4">
                          <div className="font-medium">{item.name}</div>
                          <div className="text-xs text-muted-foreground">{item.description}</div>
                        </td>
                        <td className="py-4 px-4">{item.hsnCode}</td>
                        <td className="py-4 px-4 text-right">{item.weightInGrams}</td>
                        <td className="py-4 px-4 text-right">{item.ratePerGram.toLocaleString('en-IN')}</td>
                        <td className="py-4 px-4 text-right">{item.makingCharges.toLocaleString('en-IN')}</td>
                        <td className="py-4 px-4 text-right font-medium">{item.price.toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="py-8 grid grid-cols-1 md:grid-cols-2">
                <div>
                  <h3 className="font-medium mb-3">Notes</h3>
                  <p className="text-sm text-muted-foreground">{INVOICE.notes}</p>
                </div>
                
                <div className="mt-6 md:mt-0 md:ml-auto md:w-72">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal:</span>
                      <span>₹{INVOICE.subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">CGST (1.5%):</span>
                      <span>₹{INVOICE.cgstTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">SGST (1.5%):</span>
                      <span>₹{INVOICE.sgstTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span>₹{INVOICE.grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
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
