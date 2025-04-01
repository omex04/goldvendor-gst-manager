
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { saveInvoice } from '@/services/invoiceService';
import { calculateInvoiceTotals, useGoldGSTRates } from '@/utils/gstCalculator';
import { useSettings } from '@/context/SettingsContext';
import type { Invoice, InvoiceItem } from '@/types';

export function useInvoiceForm(onInvoiceCreated?: () => Promise<void>) {
  const navigate = useNavigate();
  const { settings, isLoading: settingsLoading } = useSettings();
  const goldRates = useGoldGSTRates();
  
  const [invoice, setInvoice] = useState<Omit<Invoice, 'subtotal' | 'cgstTotal' | 'sgstTotal' | 'grandTotal'>>({
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
    onSuccess: async (invoiceId) => {
      toast.success('Invoice saved successfully');
      if (onInvoiceCreated) {
        await onInvoiceCreated();
      }
      navigate(`/view-invoice/${invoiceId}`);
    },
    onError: (error) => {
      toast.error('Failed to save invoice');
      console.error(error);
    },
  });
  
  const addItem = () => {
    const newItem: InvoiceItem = {
      id: uuidv4(),
      name: '',
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
      totalAmount: 0,
    };
    
    setInvoice({
      ...invoice,
      items: [...invoice.items, newItem],
    });
  };
  
  const updateItem = (index: number, updatedItem: InvoiceItem) => {
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

  const handleStatusChange = (value: string) => {
    setInvoice({
      ...invoice,
      status: value as "draft" | "sent" | "paid" | "cancelled",
    });
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setInvoice({
        ...invoice,
        date: date,
      });
    }
  };

  const handleDueDateChange = (date: Date | undefined) => {
    if (date) {
      setInvoice({
        ...invoice,
        dueDate: date,
      });
    }
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

  return {
    invoice,
    subtotal,
    cgstTotal,
    sgstTotal,
    grandTotal,
    saveInvoiceMutation,
    addItem,
    updateItem,
    removeItem,
    handleCustomerChange,
    handleNotesChange,
    handleInvoiceNumberChange,
    handlePaymentMethodChange,
    handleStatusChange,
    handleDateChange,
    handleDueDateChange,
    saveInvoiceDraft,
    generateInvoice,
    settings
  };
}
