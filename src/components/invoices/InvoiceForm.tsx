
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { calculateGST, getGoldGSTRates, calculatePriceByWeight, calculateInvoiceTotals } from '@/utils/gstCalculator';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { saveInvoice } from '@/services/invoiceService';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Invoice, InvoiceItem } from '@/types';

// DatePicker component for reuse
const DatePicker = ({ date, setDate, placeholder }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};

export function InvoiceForm() {
  const navigate = useNavigate();
  const [vendorInfo, setVendorInfo] = useState({
    name: 'Your Jewelry Shop',
    address: '123 Jewelry Lane, Diamond District',
    phone: '9876543210',
    email: 'contact@yourjewelryshop.com',
    gstNo: '27AABCD1234A1Z5',
    panNo: 'AABCD1234A',
    bankDetails: {
      accountName: 'Your Jewelry Shop',
      accountNumber: '1234567890',
      bankName: 'State Bank of India',
      ifscCode: 'SBIN0001234',
      branch: 'Diamond District Branch',
    },
  });

  const [invoice, setInvoice] = useState<{
    id: string;
    invoiceNumber: string;
    date: Date;
    dueDate: Date;
    customer: {
      id: string;
      name: string;
      address: string;
      phone: string;
      email: string;
      gstNo: string;
    };
    items: InvoiceItem[];
    notes: string;
    status: "draft" | "sent" | "paid" | "cancelled";
    paymentMethod: string;
  }>({
    id: uuidv4(),
    invoiceNumber: `INV-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
    date: new Date(),
    dueDate: new Date(new Date().setDate(new Date().getDate() + 30)),
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
    paymentMethod: 'Cash/UPI/Bank Transfer',
  });
  
  const [subtotal, setSubtotal] = useState(0);
  const [cgstTotal, setCgstTotal] = useState(0);
  const [sgstTotal, setSgstTotal] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const { subtotal, cgstTotal, sgstTotal, grandTotal } = calculateInvoiceTotals(invoice.items);
    setSubtotal(subtotal);
    setCgstTotal(cgstTotal);
    setSgstTotal(sgstTotal);
    setGrandTotal(grandTotal);
  }, [invoice.items]);

  const queryClient = useQueryClient();
  
  const saveInvoiceMutation = useMutation({
    mutationFn: saveInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast.success('Invoice saved successfully');
      navigate('/invoice-history');
    },
    onError: (error) => {
      toast.error('Failed to save invoice');
      console.error('Error saving invoice:', error);
    },
  });

  const handleAddItem = () => {
    const goldRates = getGoldGSTRates();
    const newItem: InvoiceItem = {
      id: uuidv4(),
      name: '',
      description: '',
      hsnCode: '7113',
      quantity: 1,
      weightInGrams: 0,
      ratePerGram: 0,
      price: 0,
      makingCharges: 0,
      cgstRate: goldRates.cgst,
      sgstRate: goldRates.sgst,
      cgstAmount: 0,
      sgstAmount: 0,
      totalAmount: 0
    };
    
    setInvoice(prev => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
  };

  const handleRemoveItem = (id: string) => {
    setInvoice(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id),
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!invoice.customer.name || invoice.items.length === 0) {
      toast.error('Please add customer details and at least one item');
      return;
    }
    
    const completeInvoice: Invoice = {
      ...invoice,
      subtotal,
      cgstTotal,
      sgstTotal,
      grandTotal,
    };
    
    saveInvoiceMutation.mutate(completeInvoice);
  };

  const handleItemChange = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    const { name, value } = e.target;
    const numValue = name === 'name' || name === 'description' ? value : parseFloat(value) || 0;
    
    setInvoice(prev => {
      const updatedItems = prev.items.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, [name]: numValue };
          
          // Recalculate price if weight or rate changes
          if (name === 'weightInGrams' || name === 'ratePerGram' || name === 'makingCharges') {
            const weight = name === 'weightInGrams' ? numValue : item.weightInGrams || 0;
            const rate = name === 'ratePerGram' ? numValue : item.ratePerGram || 0;
            const making = name === 'makingCharges' ? numValue : item.makingCharges || 0;
            
            updatedItem.price = calculatePriceByWeight(weight, rate, making);
          }
          
          // Recalculate GST
          const { cgstAmount, sgstAmount, totalAmount } = calculateGST(
            updatedItem.price,
            updatedItem.cgstRate,
            updatedItem.sgstRate
          );
          
          updatedItem.cgstAmount = cgstAmount;
          updatedItem.sgstAmount = sgstAmount;
          updatedItem.totalAmount = totalAmount;
          
          return updatedItem;
        }
        return item;
      });
      
      return { ...prev, items: updatedItems };
    });
  };

  const handleDateChange = (date: Date | undefined, field: 'date' | 'dueDate') => {
    if (date) {
      setInvoice(prev => ({ ...prev, [field]: date }));
    }
  };

  const togglePreview = () => {
    if (invoice.customer.name === '' || invoice.items.length === 0) {
      toast.error('Please add customer details and at least one item before previewing');
      return;
    }
    setShowPreview(!showPreview);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        {!showPreview ? (
          <>
            <Card>
              <CardContent className="space-y-4 pt-4">
                <h2 className="text-lg font-semibold">Vendor Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Vendor Name"
                    value={vendorInfo.name}
                    onChange={(e) => setVendorInfo(prev => ({ ...prev, name: e.target.value }))}
                  />
                  <Input
                    placeholder="GST Number"
                    value={vendorInfo.gstNo}
                    onChange={(e) => setVendorInfo(prev => ({ ...prev, gstNo: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Phone Number"
                    value={vendorInfo.phone}
                    onChange={(e) => setVendorInfo(prev => ({ ...prev, phone: e.target.value }))}
                  />
                  <Input
                    placeholder="Email"
                    value={vendorInfo.email}
                    onChange={(e) => setVendorInfo(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <Textarea
                  placeholder="Address"
                  value={vendorInfo.address}
                  onChange={(e) => setVendorInfo(prev => ({ ...prev, address: e.target.value }))}
                  rows={2}
                />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="space-y-4 pt-4">
                <h2 className="text-lg font-semibold">Invoice Details</h2>
                <Input
                  placeholder="Customer Name"
                  value={invoice.customer.name}
                  onChange={(e) => setInvoice(prev => ({ ...prev, customer: { ...prev.customer, name: e.target.value } }))}
                  required
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Customer Address"
                    value={invoice.customer.address}
                    onChange={(e) => setInvoice(prev => ({ ...prev, customer: { ...prev.customer, address: e.target.value } }))}
                  />
                  <Input
                    placeholder="Customer Phone"
                    value={invoice.customer.phone}
                    onChange={(e) => setInvoice(prev => ({ ...prev, customer: { ...prev.customer, phone: e.target.value } }))}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Customer Email"
                    type="email"
                    value={invoice.customer.email}
                    onChange={(e) => setInvoice(prev => ({ ...prev, customer: { ...prev.customer, email: e.target.value } }))}
                  />
                  <Input
                    placeholder="Customer GST Number (Optional)"
                    value={invoice.customer.gstNo}
                    onChange={(e) => setInvoice(prev => ({ ...prev, customer: { ...prev.customer, gstNo: e.target.value } }))}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Invoice Date</label>
                    <DatePicker 
                      date={invoice.date} 
                      setDate={(date) => handleDateChange(date, 'date')} 
                      placeholder="Select invoice date"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Due Date</label>
                    <DatePicker 
                      date={invoice.dueDate} 
                      setDate={(date) => handleDateChange(date, 'dueDate')} 
                      placeholder="Select due date"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Notes</label>
                  <Textarea
                    placeholder="Invoice notes"
                    value={invoice.notes}
                    onChange={(e) => setInvoice(prev => ({ ...prev, notes: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Payment Method</label>
                  <Select 
                    value={invoice.paymentMethod} 
                    onValueChange={(value) => setInvoice(prev => ({ ...prev, paymentMethod: value }))}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select Payment Method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cash">Cash</SelectItem>
                      <SelectItem value="UPI">UPI</SelectItem>
                      <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                      <SelectItem value="Cash/UPI/Bank Transfer">Multiple Methods</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="space-y-4 pt-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-md font-semibold">Invoice Items</h3>
                  <Button type="button" onClick={handleAddItem} size="sm">Add Item</Button>
                </div>
                
                {invoice.items.length === 0 && (
                  <div className="text-center py-8 border border-dashed rounded-md">
                    <p className="text-muted-foreground">No items added yet. Click "Add Item" to start.</p>
                  </div>
                )}
                
                {invoice.items.map((item, index) => (
                  <div key={item.id} className="border p-4 rounded-md mb-3">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">Item #{index + 1}</h4>
                      <Button 
                        type="button" 
                        onClick={() => handleRemoveItem(item.id)} 
                        variant="outline" 
                        size="sm"
                      >
                        Remove
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                      <Input
                        name="name"
                        value={item.name}
                        onChange={(e) => handleItemChange(e as any, item.id)}
                        placeholder="Item Name"
                      />
                      <Input
                        name="description"
                        value={item.description}
                        onChange={(e) => handleItemChange(e as any, item.id)}
                        placeholder="Item Description"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                      <Input
                        name="weightInGrams"
                        type="number"
                        value={item.weightInGrams}
                        onChange={(e) => handleItemChange(e as any, item.id)}
                        placeholder="Weight (grams)"
                      />
                      <Input
                        name="ratePerGram"
                        type="number"
                        value={item.ratePerGram}
                        onChange={(e) => handleItemChange(e as any, item.id)}
                        placeholder="Rate per gram"
                      />
                      <Input
                        name="makingCharges"
                        type="number"
                        value={item.makingCharges}
                        onChange={(e) => handleItemChange(e as any, item.id)}
                        placeholder="Making Charges"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <div className="border rounded p-2 bg-gray-50">
                        <label className="text-xs text-gray-500">Item Total</label>
                        <p className="font-medium">₹{item.price.toFixed(2)}</p>
                      </div>
                      <div className="border rounded p-2 bg-gray-50">
                        <label className="text-xs text-gray-500">CGST @{item.cgstRate}%</label>
                        <p className="font-medium">₹{item.cgstAmount.toFixed(2)}</p>
                      </div>
                      <div className="border rounded p-2 bg-gray-50">
                        <label className="text-xs text-gray-500">SGST @{item.sgstRate}%</label>
                        <p className="font-medium">₹{item.sgstAmount.toFixed(2)}</p>
                      </div>
                      <div className="border rounded p-2 bg-blue-50">
                        <label className="text-xs text-gray-500">Total</label>
                        <p className="font-medium">₹{item.totalAmount.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ))}

                {invoice.items.length > 0 && (
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Subtotal:</span>
                      <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>CGST:</span>
                      <span>₹{cgstTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>SGST:</span>
                      <span>₹{sgstTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span>Grand Total:</span>
                      <span>₹{grandTotal.toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        ) : (
          <Card className="p-6">
            <div className="border-b pb-4 mb-4">
              <h1 className="text-2xl font-bold text-center">{vendorInfo.name}</h1>
              <p className="text-center text-gray-600">{vendorInfo.address}</p>
              <p className="text-center text-gray-600">Phone: {vendorInfo.phone} | Email: {vendorInfo.email}</p>
              <p className="text-center text-gray-600">GST No: {vendorInfo.gstNo}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <h2 className="font-semibold">Invoice To:</h2>
                <p>{invoice.customer.name}</p>
                <p>{invoice.customer.address}</p>
                <p>Phone: {invoice.customer.phone}</p>
                {invoice.customer.gstNo && <p>GST No: {invoice.customer.gstNo}</p>}
              </div>
              <div className="text-right">
                <h2 className="font-semibold">Invoice Details:</h2>
                <p>Invoice No: {invoice.invoiceNumber}</p>
                <p>Date: {format(invoice.date, 'dd MMM yyyy')}</p>
                <p>Due Date: {format(invoice.dueDate, 'dd MMM yyyy')}</p>
              </div>
            </div>
            
            <table className="min-w-full border mb-6">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border p-2 text-left">Item</th>
                  <th className="border p-2 text-right">Weight</th>
                  <th className="border p-2 text-right">Rate</th>
                  <th className="border p-2 text-right">Making</th>
                  <th className="border p-2 text-right">Amount</th>
                  <th className="border p-2 text-right">GST</th>
                  <th className="border p-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, index) => (
                  <tr key={index}>
                    <td className="border p-2">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-gray-600">{item.description}</div>
                    </td>
                    <td className="border p-2 text-right">{item.weightInGrams}g</td>
                    <td className="border p-2 text-right">₹{item.ratePerGram}/g</td>
                    <td className="border p-2 text-right">₹{item.makingCharges}</td>
                    <td className="border p-2 text-right">₹{item.price.toFixed(2)}</td>
                    <td className="border p-2 text-right">
                      <div>CGST: ₹{item.cgstAmount.toFixed(2)}</div>
                      <div>SGST: ₹{item.sgstAmount.toFixed(2)}</div>
                    </td>
                    <td className="border p-2 text-right font-medium">₹{item.totalAmount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-50">
                  <td colSpan={4} className="border p-2 text-right font-medium">Subtotal</td>
                  <td className="border p-2 text-right">₹{subtotal.toFixed(2)}</td>
                  <td className="border p-2 text-right">
                    <div>CGST: ₹{cgstTotal.toFixed(2)}</div>
                    <div>SGST: ₹{sgstTotal.toFixed(2)}</div>
                  </td>
                  <td className="border p-2 text-right font-bold">₹{grandTotal.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
            
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="font-semibold mb-2">Payment Method</h3>
                <p>{invoice.paymentMethod}</p>
                {invoice.notes && (
                  <>
                    <h3 className="font-semibold mt-4 mb-2">Notes</h3>
                    <p>{invoice.notes}</p>
                  </>
                )}
              </div>
              <div>
                <h3 className="font-semibold mb-2">Bank Details</h3>
                <p>Account Name: {vendorInfo.bankDetails.accountName}</p>
                <p>Account Number: {vendorInfo.bankDetails.accountNumber}</p>
                <p>Bank: {vendorInfo.bankDetails.bankName}</p>
                <p>IFSC: {vendorInfo.bankDetails.ifscCode}</p>
                <p>Branch: {vendorInfo.bankDetails.branch}</p>
              </div>
            </div>
            
            <div className="text-center text-gray-500 mt-8">
              <p>Thank you for your business!</p>
            </div>
          </Card>
        )}

        <div className="flex justify-between items-center mt-8">
          <Button type="button" variant="outline" onClick={togglePreview}>
            {showPreview ? 'Edit Invoice' : 'Preview Invoice'}
          </Button>
          <div className="space-x-2">
            {showPreview && (
              <Button type="button" variant="outline">
                Download PDF
              </Button>
            )}
            <Button type="submit">Save Invoice</Button>
          </div>
        </div>
      </div>
    </form>
  );
}
