import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { DatePicker } from '@/components/ui/calendar';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { CalculateGST } from '@/utils/gstCalculator';
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
    const { subtotal, cgst, sgst, grand } = CalculateGST(invoice.items);
    setSubtotal(subtotal);
    setCgstTotal(cgst);
    setSgstTotal(sgst);
    setGrandTotal(grand);
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

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent>
          <h2 className="text-lg font-semibold">Invoice Details</h2>
          <Input
            placeholder="Customer Name"
            value={invoice.customer.name}
            onChange={(e) => setInvoice(prev => ({ ...prev, customer: { ...prev.customer, name: e.target.value } }))}
            required
          />
          <DatePicker
            selected={invoice.date}
            onChange={(date) => setInvoice(prev => ({ ...prev, date }))}
          />
          <Textarea
            placeholder="Notes"
            value={invoice.notes}
            onChange={(e) => setInvoice(prev => ({ ...prev, notes: e.target.value }))}
          />
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select Payment Method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Cash">Cash</SelectItem>
              <SelectItem value="UPI">UPI</SelectItem>
              <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
            </SelectContent>
          </Select>
          <Button type="button" onClick={handleAddItem}>Add Item</Button>
          {invoice.items.map(item => (
            <div key={item.id}>
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
              <Button type="button" onClick={() => handleRemoveItem(item.id)}>Remove</Button>
            </div>
          ))}
        </CardContent>
        <Button type="submit">Save Invoice</Button>
      </Card>
    </form>
  );
}
