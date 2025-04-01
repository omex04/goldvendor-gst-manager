
import React from 'react';
import { PageTransition } from '@/components/ui/PageTransition';
import { InvoiceForm } from '@/components/invoices/InvoiceForm';
import SubscriptionRequired from '@/components/subscription/SubscriptionRequired';
import { useSubscription } from '@/context/SubscriptionContext';
import { updateUsage } from '@/services/subscriptionService';

const CreateInvoice = () => {
  const { refreshSubscription } = useSubscription();

  const handleInvoiceCreated = async () => {
    try {
      // Update usage when an invoice is created
      await updateUsage();
      // Refresh subscription status
      await refreshSubscription();
    } catch (error) {
      console.error('Error updating usage:', error);
    }
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Invoice</h1>
          <p className="text-muted-foreground">Create a new GST invoice for gold jewelry items</p>
        </div>
        
        <SubscriptionRequired>
          <InvoiceForm onInvoiceCreated={handleInvoiceCreated} />
        </SubscriptionRequired>
      </div>
    </PageTransition>
  );
};

export default CreateInvoice;
