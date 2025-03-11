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
import { calculateInvoiceTotals, useGoldGSTRates } from '@/utils/gstCalculator';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { saveInvoice } from '@/services/invoiceService';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSettings } from '@/context/SettingsContext';

export function InvoiceForm() {
  const navigate = useNavigate();
  const { settings, isLoading: settingsLoading } = useSettings();
  const goldRates = useGoldGSTRates();
  
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
    paymentMethod: 'cash',
  });
  
  const [subtotal, setSubtotal] = useState(0);
  const [cgstTotal, setCgstTotal] = useState(0);
  const [sgstTotal, setSgstTotal] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  
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
  
  const updateItem = (index: number, updatedItem: any) => {
    const updatedItems = [...invoice.items];
    updatedItems[index] = updatedItem;
    
    setInvoice({
      ...invoice,
      items: updatedItems,
    });
  };
  
  const removeItem = (index: number) => {
    const updatedItems = [...invoice.items];
    updatedItems.splice(index, 1);
    
    setInvoice({
      ...invoice,
      items: updatedItems,
    });
  };
  
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
  
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInvoice({
      ...invoice,
      notes: e.target.value,
    });
  };

  const handleInvoiceNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInvoice({
      ...invoice,
      invoiceNumber: e.target.value,
    });
  };

  const handlePaymentMethodChange = (value: string) => {
    setInvoice({
      ...invoice,
      paymentMethod: value,
    });
  };
  
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
  
  useEffect(() => {
    const autoSaveDraft = async () => {
      if (
        !settingsLoading && 
        settings.preferences.autoSave &&
        invoice.customer.name &&
        invoice.customer.address &&
        invoice.customer.phone &&
        invoice.items.length > 0 &&
        !saveInvoiceMutation.isPending
      ) {
        const completeInvoice = {
          ...invoice,
          subtotal,
          cgstTotal,
          sgstTotal,
          grandTotal,
          status: 'draft' as const,
        };
        
        try {
          await saveInvoice(completeInvoice);
          console.log('Auto-saved invoice draft');
        } catch (error) {
          console.error('Failed to auto-save invoice:', error);
        }
      }
    };
    
    const autoSaveTimer = setInterval(autoSaveDraft, 120000);
    
    return () => {
      clearInterval(autoSaveTimer);
    };
  }, [invoice, subtotal, cgstTotal, sgstTotal, grandTotal, settings.preferences.autoSave, settingsLoading, saveInvoiceMutation.isPending]);
  
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
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg dark:text-white">Vendor Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="vendor-name" className="dark:text-gray-300">Business Name</Label>
              <Input 
                id="vendor-name" 
                value={settings.vendor.name} 
                className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                readOnly
              />
            </div>
            <div>
              <Label htmlFor="vendor-gst" className="dark:text-gray-300">GSTIN</Label>
              <Input 
                id="vendor-gst" 
                value={settings.vendor.gstNo} 
                className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                readOnly
              />
            </div>
            <div>
              <Label htmlFor="vendor-address" className="dark:text-gray-300">Address</Label>
              <Input 
                id="vendor-address" 
                value={settings.vendor.address} 
                className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                readOnly
              />
            </div>
          </CardContent>
        </Card>
        
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg dark:text-white">Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="customer-name" className="dark:text-gray-300">Customer Name</Label>
              <Input 
                id="customer-name" 
                name="name"
                value={invoice.customer.name}
                onChange={handleCustomerChange}
                className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Enter customer name"
              />
            </div>
            <div>
              <Label htmlFor="customer-address" className="dark:text-gray-300">Address</Label>
              <Input 
                id="customer-address" 
                name="address"
                value={invoice.customer.address}
                onChange={handleCustomerChange}
                className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Enter customer address"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customer-phone" className="dark:text-gray-300">Phone</Label>
                <Input 
                  id="customer-phone" 
                  name="phone"
                  value={invoice.customer.phone}
                  onChange={handleCustomerChange}
                  className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Phone number"
                />
              </div>
              <div>
                <Label htmlFor="customer-gst" className="dark:text-gray-300">GSTIN (optional)</Label>
                <Input 
                  id="customer-gst" 
                  name="gstNo"
                  value={invoice.customer.gstNo}
                  onChange={handleCustomerChange}
                  className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Customer GSTIN"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg dark:text-white">Invoice Details</CardTitle>
          <div className="flex items-center gap-4">
            <div className="text-sm flex items-end gap-2">
              <div>
                <Label htmlFor="invoice-number" className="text-xs text-muted-foreground dark:text-gray-400">Invoice #</Label>
                <Input
                  id="invoice-number"
                  value={invoice.invoiceNumber}
                  onChange={handleInvoiceNumberChange}
                  className="w-[120px] h-8 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="invoice-date" className="text-xs text-muted-foreground dark:text-gray-400">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className="w-[160px] pl-3 text-left font-normal mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    {invoice.date ? (
                      format(invoice.date, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 dark:bg-gray-800 dark:border-gray-700" align="start">
                  <Calendar
                    mode="single"
                    selected={invoice.date}
                    onSelect={(date) => setInvoice({ ...invoice, date: date as Date })}
                    initialFocus
                    className="dark:bg-gray-800"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="payment-method" className="dark:text-gray-300">Payment Method</Label>
              <Select 
                value={invoice.paymentMethod} 
                onValueChange={handlePaymentMethodChange}
              >
                <SelectTrigger id="payment-method" className="w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="upi">UPI</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="cheque">Cheque</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="invoice-status" className="dark:text-gray-300">Status</Label>
              <Select 
                value={invoice.status} 
                onValueChange={(value) => setInvoice({ ...invoice, status: value })}
              >
                <SelectTrigger id="invoice-status" className="w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="due-date" className="dark:text-gray-300">Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="due-date"
                    variant={"outline"}
                    className="w-full pl-3 text-left font-normal mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    {invoice.dueDate ? (
                      format(invoice.dueDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 dark:bg-gray-800 dark:border-gray-700" align="start">
                  <Calendar
                    mode="single"
                    selected={invoice.dueDate}
                    onSelect={(date) => setInvoice({ ...invoice, dueDate: date as Date })}
                    initialFocus
                    className="dark:bg-gray-800"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="mb-4">
            <Button variant="outline" onClick={addItem} className="flex items-center gap-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
              <Plus className="h-4 w-4" />
              Add Item
            </Button>
          </div>
          
          {invoice.items.length === 0 ? (
            <div className="text-center py-8 border border-dashed rounded-lg dark:border-gray-700 dark:text-gray-400">
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
          
          <div className="mt-8 border-t pt-6 dark:border-gray-700">
            <div className="flex flex-col gap-2 md:w-72 ml-auto">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground dark:text-gray-400">Subtotal:</span>
                <span className="dark:text-white">₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground dark:text-gray-400">CGST:</span>
                <span className="dark:text-white">₹{cgstTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground dark:text-gray-400">SGST:</span>
                <span className="dark:text-white">₹{sgstTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between font-medium border-t pt-2 mt-2 dark:border-gray-700">
                <span className="dark:text-white">Total:</span>
                <span className="dark:text-white">₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <Label htmlFor="notes" className="dark:text-gray-300">Notes</Label>
            <Textarea
              id="notes"
              value={invoice.notes}
              onChange={handleNotesChange}
              placeholder="Enter additional notes or terms & conditions"
              className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              rows={3}
            />
          </div>
          
          <div className="mt-6 flex justify-end gap-4">
            <Button 
              variant="outline" 
              onClick={saveInvoiceDraft}
              disabled={saveInvoiceMutation.isPending}
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600"
            >
              Save as Draft
            </Button>
            <Button 
              onClick={generateInvoice} 
              className="bg-gold-500 hover:bg-gold-600 text-primary-foreground dark:bg-gold-600 dark:hover:bg-gold-700"
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
