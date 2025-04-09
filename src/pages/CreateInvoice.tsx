
import React, { useEffect } from 'react';
import { PageTransition } from '@/components/ui/PageTransition';
import { InvoiceForm } from '@/components/invoices/InvoiceForm';
import SubscriptionRequired from '@/components/subscription/SubscriptionRequired';
import { useSubscription } from '@/context/SubscriptionContext';
import { updateUsage } from '@/services/subscriptionService';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const CreateInvoice = () => {
  const { refreshSubscription, canCreateInvoice, isSubscribed, freeUsage } = useSubscription();
  const navigate = useNavigate();

  // Check if user can create invoices on page load
  useEffect(() => {
    refreshSubscription();
  }, []);

  const handleInvoiceCreated = async () => {
    try {
      // Update usage when an invoice is created
      const response = await updateUsage();
      
      // Handle usage limit errors
      if (!response.success && response.error) {
        toast.error(response.error);
        navigate('/pricing');
        return;
      }
      
      // Show subscription prompt when user is on their last free invoice
      if (!isSubscribed && freeUsage.used === freeUsage.limit - 1) {
        toast.success("Invoice created! You have used all your free invoices. Please subscribe to create more.");
      } else if (!isSubscribed) {
        const remainingInvoices = freeUsage.limit - freeUsage.used - 1;
        toast.success(`Invoice created! You have ${remainingInvoices} free ${remainingInvoices === 1 ? 'invoice' : 'invoices'} remaining.`);
      } else {
        toast.success("Invoice created successfully!");
      }
      
      // Refresh subscription status
      await refreshSubscription();
    } catch (error) {
      console.error('Error updating usage:', error);
      toast.error('Error tracking invoice usage. Please try again.');
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
