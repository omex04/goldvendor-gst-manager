
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { DatePicker } from '@/components/ui/date-picker';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { calculateInvoiceTotals } from '@/utils/gstCalculator';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { saveInvoice } from '@/services/invoiceService';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Invoice } from '@/types';

export function InvoiceForm() {
  const navigate = useNavigate();
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
    items: any[];
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

  useEffect(() => {
    // Replace CalculateGST with calculateInvoiceTotals
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
    setInvoice(prev => ({
      ...prev,
      items: [...prev.items, { id: uuidv4(), description: '', quantity: 1, rate: 0 }],
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    const { name, value } = e.target;
    setInvoice(prev => ({
      ...prev,
      items: prev.items.map(item => item.id === id ? { ...item, [name]: value } : item),
    }));
  };

  const handleDateChange = (date: Date | undefined, field: 'date' | 'dueDate') => {
    if (date) {
      setInvoice(prev => ({ ...prev, [field]: date }));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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
          
          <div className="border-t pt-4">
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Input
                    name="description"
                    value={item.description}
                    onChange={(e) => handleInputChange(e, item.id)}
                    placeholder="Item Description"
                  />
                  <Input
                    name="quantity"
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleInputChange(e, item.id)}
                    placeholder="Quantity"
                  />
                  <Input
                    name="rate"
                    type="number"
                    value={item.rate}
                    onChange={(e) => handleInputChange(e, item.id)}
                    placeholder="Rate"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <div className="p-4 flex justify-end">
          <Button type="submit">Save Invoice</Button>
        </div>
      </Card>
    </form>
  );
}
