
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { Label } from '@/components/ui/label';
import { InvoiceItem } from './InvoiceItem';
import { calculateInvoiceTotals, getGoldGSTRates } from '@/utils/gstCalculator';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { saveInvoice } from '@/services/invoiceService';

export function InvoiceForm() {
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState({
    id: uuidv4(),
    invoiceNumber: `INV-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
    date: new Date(),
    dueDate: new Date(new Date().setDate(new Date().getDate() + 7)),
    customer: {
      id: uuidv4(),
      name: '',
      address: '',
      phone: '',
      email: '',
      gstNo: '',
    },
    items: [],
    notes: '',
    status: 'draft',
  });
  
  const [subtotal, setSubtotal] = useState(0);
  const [cgstTotal, setCgstTotal] = useState(0);
  const [sgstTotal, setSgstTotal] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  
  const goldRates = getGoldGSTRates();
  
  // Save invoice mutation
  const saveInvoiceMutation = useMutation({
    mutationFn: saveInvoice,
    onSuccess: (invoiceId) => {
      toast.success('Invoice saved successfully');
      navigate(`/view-invoice/${invoiceId}`);
    },
    onError: (error) => {
      toast.error('Failed to save invoice');
      console.error(error);
    },
  });
  
  // Add a new empty item
  const addItem = () => {
    const newItem = {
      id: uuidv4(),
      name: '',
      hsnCode: '7113',
      quantity: 1,
      weightInGrams: '',
      ratePerGram: '',
      price: 0,
      makingCharges: 0,
      cgstRate: goldRates.cgst,
      sgstRate: goldRates.sgst,
      cgstAmount: 0,
      sgstAmount: 0,
      totalAmount: 0,
    };
    
    setInvoice({
      ...invoice,
      items: [...invoice.items, newItem],
    });
  };
  
  // Update an item in the items array
  const updateItem = (index: number, updatedItem: any) => {
    const updatedItems = [...invoice.items];
    updatedItems[index] = updatedItem;
    
    setInvoice({
      ...invoice,
      items: updatedItems,
    });
  };
  
  // Remove an item from the items array
  const removeItem = (index: number) => {
    const updatedItems = [...invoice.items];
    updatedItems.splice(index, 1);
    
    setInvoice({
      ...invoice,
      items: updatedItems,
    });
  };
  
  // Update customer information
  const handleCustomerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInvoice({
      ...invoice,
      customer: {
        ...invoice.customer,
        [name]: value,
      },
    });
  };
  
  // Update invoice notes
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInvoice({
      ...invoice,
      notes: e.target.value,
    });
  };

  // Update invoice number
  const handleInvoiceNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInvoice({
      ...invoice,
      invoiceNumber: e.target.value,
    });
  };
  
  // Calculate totals whenever items change
  useEffect(() => {
    if (invoice.items.length > 0) {
      const { subtotal, cgstTotal, sgstTotal, grandTotal } = calculateInvoiceTotals(invoice.items);
      setSubtotal(subtotal);
      setCgstTotal(cgstTotal);
      setSgstTotal(sgstTotal);
      setGrandTotal(grandTotal);
    } else {
      setSubtotal(0);
      setCgstTotal(0);
      setSgstTotal(0);
      setGrandTotal(0);
    }
  }, [invoice.items]);
  
  // Save the invoice
  const saveInvoiceDraft = () => {
    if (!invoice.customer.name || !invoice.customer.address || !invoice.customer.phone) {
      toast.error('Please fill in customer details');
      return;
    }

    if (invoice.items.length === 0) {
      toast.error('Please add at least one item');
      return;
    }

    const completeInvoice = {
      ...invoice,
      subtotal,
      cgstTotal,
      sgstTotal,
      grandTotal,
      status: 'draft' as const,
    };
    
    saveInvoiceMutation.mutate(completeInvoice);
  };
  
  // Generate and send the invoice
  const generateInvoice = () => {
    if (!invoice.customer.name || !invoice.customer.address || !invoice.customer.phone) {
      toast.error('Please fill in customer details');
      return;
    }

    if (invoice.items.length === 0) {
      toast.error('Please add at least one item');
      return;
    }

    const completeInvoice = {
      ...invoice,
      subtotal,
      cgstTotal,
      sgstTotal,
      grandTotal,
      status: 'sent' as const,
    };
    
    saveInvoiceMutation.mutate(completeInvoice);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Vendor Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="vendor-name">Business Name</Label>
              <Input 
                id="vendor-name" 
                value="Gold Jewelry Shop" 
                className="mt-1"
                readOnly
              />
            </div>
            <div>
              <Label htmlFor="vendor-gst">GSTIN</Label>
              <Input 
                id="vendor-gst" 
                value="27AADCG1234A1Z5" 
                className="mt-1"
                readOnly
              />
            </div>
            <div>
              <Label htmlFor="vendor-address">Address</Label>
              <Input 
                id="vendor-address" 
                value="123 Jewelers Lane, Mumbai, Maharashtra" 
                className="mt-1"
                readOnly
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="customer-name">Customer Name</Label>
              <Input 
                id="customer-name" 
                name="name"
                value={invoice.customer.name}
                onChange={handleCustomerChange}
                className="mt-1"
                placeholder="Enter customer name"
              />
            </div>
            <div>
              <Label htmlFor="customer-address">Address</Label>
              <Input 
                id="customer-address" 
                name="address"
                value={invoice.customer.address}
                onChange={handleCustomerChange}
                className="mt-1"
                placeholder="Enter customer address"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customer-phone">Phone</Label>
                <Input 
                  id="customer-phone" 
                  name="phone"
                  value={invoice.customer.phone}
                  onChange={handleCustomerChange}
                  className="mt-1"
                  placeholder="Phone number"
                />
              </div>
              <div>
                <Label htmlFor="customer-gst">GSTIN (optional)</Label>
                <Input 
                  id="customer-gst" 
                  name="gstNo"
                  value={invoice.customer.gstNo}
                  onChange={handleCustomerChange}
                  className="mt-1"
                  placeholder="Customer GSTIN"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Invoice Details</CardTitle>
          <div className="flex items-center gap-4">
            <div className="text-sm flex items-end gap-2">
              <div>
                <Label htmlFor="invoice-number" className="text-xs text-muted-foreground">Invoice #</Label>
                <Input
                  id="invoice-number"
                  value={invoice.invoiceNumber}
                  onChange={handleInvoiceNumberChange}
                  className="w-[120px] h-8 text-sm"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="invoice-date" className="text-xs text-muted-foreground">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className="w-[160px] pl-3 text-left font-normal mt-1"
                  >
                    {invoice.date ? (
                      format(invoice.date, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={invoice.date}
                    onSelect={(date) => setInvoice({ ...invoice, date: date as Date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Button variant="outline" onClick={addItem} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Item
            </Button>
          </div>
          
          {invoice.items.length === 0 ? (
            <div className="text-center py-8 border border-dashed rounded-lg">
              <p className="text-muted-foreground">No items added yet. Click 'Add Item' to begin.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {invoice.items.map((item, index) => (
                <InvoiceItem
                  key={item.id}
                  item={item}
                  index={index}
                  updateItem={updateItem}
                  removeItem={removeItem}
                />
              ))}
            </div>
          )}
          
          <div className="mt-8 border-t pt-6">
            <div className="flex flex-col gap-2 md:w-72 ml-auto">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal:</span>
                <span>₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">CGST:</span>
                <span>₹{cgstTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">SGST:</span>
                <span>₹{sgstTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between font-medium border-t pt-2 mt-2">
                <span>Total:</span>
                <span>₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={invoice.notes}
              onChange={handleNotesChange}
              placeholder="Enter additional notes or terms & conditions"
              className="mt-1"
              rows={3}
            />
          </div>
          
          <div className="mt-6 flex justify-end gap-4">
            <Button 
              variant="outline" 
              onClick={saveInvoiceDraft}
              disabled={saveInvoiceMutation.isPending}
            >
              Save as Draft
            </Button>
            <Button 
              onClick={generateInvoice} 
              className="bg-gold-500 hover:bg-gold-600"
              disabled={saveInvoiceMutation.isPending}
            >
              Generate Invoice
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default InvoiceForm;
