
import React from 'react';
import { PageTransition } from '@/components/ui/PageTransition';
import { MainLayout } from '@/components/layout/MainLayout';
import { InvoiceForm } from '@/components/invoices/InvoiceForm';

const CreateInvoice = () => {
  return (
    <MainLayout>
      <PageTransition>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create Invoice</h1>
            <p className="text-muted-foreground">Create a new GST invoice for gold jewelry</p>
          </div>
          
          <InvoiceForm />
        </div>
      </PageTransition>
    </MainLayout>
  );
};

export default CreateInvoice;
