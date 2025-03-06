
import React from 'react';
import { PageTransition } from '@/components/ui/PageTransition';
import { InvoiceList } from '@/components/invoices/InvoiceList';

const InvoiceHistory = () => {
  return (
    <PageTransition>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Invoice History</h1>
          <p className="text-muted-foreground">View, manage, and export your invoice records</p>
        </div>
        
        <InvoiceList />
      </div>
    </PageTransition>
  );
};

export default InvoiceHistory;
