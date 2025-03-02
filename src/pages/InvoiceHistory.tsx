
import React from 'react';
import { PageTransition } from '@/components/ui/PageTransition';
import { MainLayout } from '@/components/layout/MainLayout';
import { InvoiceList } from '@/components/invoices/InvoiceList';

const InvoiceHistory = () => {
  return (
    <MainLayout>
      <PageTransition>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Invoice History</h1>
            <p className="text-muted-foreground">View and manage all your invoices</p>
          </div>
          
          <InvoiceList />
        </div>
      </PageTransition>
    </MainLayout>
  );
};

export default InvoiceHistory;
