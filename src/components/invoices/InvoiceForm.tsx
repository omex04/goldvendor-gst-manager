
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useInvoiceForm } from './form/useInvoiceForm';
import { VendorInfoSection } from './form/VendorInfoSection';
import { CustomerInfoSection } from './form/CustomerInfoSection';
import { InvoiceDetailsHeader } from './form/InvoiceDetailsHeader';
import { InvoiceDetailsSettings } from './form/InvoiceDetailsSettings';
import { InvoiceItemsList } from './form/InvoiceItemsList';
import { InvoiceSummary } from './form/InvoiceSummary';
import { NotesSection } from './form/NotesSection';
import { ActionButtons } from './form/ActionButtons';

interface InvoiceFormProps {
  onInvoiceCreated?: () => Promise<void>;
}

export function InvoiceForm({ onInvoiceCreated }: InvoiceFormProps) {
  const {
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
  } = useInvoiceForm(onInvoiceCreated);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <VendorInfoSection vendorInfo={settings.vendor} />
        <CustomerInfoSection 
          customer={invoice.customer} 
          onChange={handleCustomerChange} 
        />
      </div>
      
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg dark:text-white">Invoice Details</CardTitle>
          <InvoiceDetailsHeader 
            invoiceNumber={invoice.invoiceNumber}
            date={invoice.date}
            onInvoiceNumberChange={handleInvoiceNumberChange}
            onDateChange={handleDateChange}
          />
        </CardHeader>
        <CardContent>
          <InvoiceDetailsSettings 
            paymentMethod={invoice.paymentMethod}
            status={invoice.status}
            dueDate={invoice.dueDate}
            onPaymentMethodChange={handlePaymentMethodChange}
            onStatusChange={handleStatusChange}
            onDueDateChange={handleDueDateChange}
          />

          <InvoiceItemsList 
            items={invoice.items}
            onAddItem={addItem}
            onUpdateItem={updateItem}
            onRemoveItem={removeItem}
          />
          
          <div className="mt-8 border-t pt-6 dark:border-gray-700">
            <InvoiceSummary 
              subtotal={subtotal}
              cgstTotal={cgstTotal}
              sgstTotal={sgstTotal}
              grandTotal={grandTotal}
            />
          </div>
          
          <div className="mt-6">
            <NotesSection 
              notes={invoice.notes} 
              onChange={handleNotesChange} 
            />
          </div>
          
          <div className="mt-6">
            <ActionButtons 
              onSaveDraft={saveInvoiceDraft}
              onGenerateInvoice={generateInvoice}
              isLoading={saveInvoiceMutation.isPending}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default InvoiceForm;
