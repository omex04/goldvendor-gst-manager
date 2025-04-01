
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  validDays: number;
  features: string[];
}

export const plans: Plan[] = [
  {
    id: 'basic',
    name: 'Basic Plan',
    description: 'Perfect for small businesses',
    price: 499,
    validDays: 30,
    features: [
      'Create up to 100 invoices per month',
      'GST Invoice generation',
      'Basic reporting',
      'Email support',
    ],
  },
  {
    id: 'premium',
    name: 'Premium Plan',
    description: 'For growing businesses',
    price: 999,
    validDays: 30,
    features: [
      'Create unlimited invoices',
      'Advanced reporting & analytics',
      'Priority support',
      'Custom business logo',
      'Multiple users',
    ],
  },
  {
    id: 'yearly',
    name: 'Yearly Plan',
    description: 'Best value for money',
    price: 7999,
    validDays: 365,
    features: [
      'All Premium features',
      'Dedicated account manager',
      'API access',
      'Save 33% compared to monthly plans',
    ],
  },
];

export const createSubscription = async (planId: string) => {
  try {
    const plan = plans.find(p => p.id === planId);
    if (!plan) throw new Error('Invalid plan selected');

    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) throw new Error('You must be logged in to subscribe');

    const response = await supabase.functions.invoke('create-subscription', {
      body: {
        planId: plan.id,
        planName: plan.name,
        amount: plan.price,
        currency: 'INR'
      },
    });

    if (!response.data || !response.data.success) {
      throw new Error(response.error || response.data?.error || 'Failed to create subscription');
    }

    return response.data.data;
  } catch (error: any) {
    console.error('Error creating subscription:', error);
    toast.error(error.message || 'Failed to create subscription');
    throw error;
  }
};

export const verifyPayment = async (params: {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
  planId: string;
}) => {
  try {
    const plan = plans.find(p => p.id === params.planId);
    if (!plan) throw new Error('Invalid plan selected');

    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) throw new Error('You must be logged in to verify payment');

    const response = await supabase.functions.invoke('verify-payment', {
      body: {
        ...params,
        planName: plan.name,
        amount: plan.price,
        validDays: plan.validDays,
      },
    });

    if (!response.data || !response.data.success) {
      throw new Error(response.error || response.data?.error || 'Failed to verify payment');
    }

    toast.success('Payment successful! Your subscription is now active.');
    return response.data.data;
  } catch (error: any) {
    console.error('Error verifying payment:', error);
    toast.error(error.message || 'Failed to verify payment');
    throw error;
  }
};

export const checkSubscription = async () => {
  try {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !sessionData.session) {
      return {
        isSubscribed: false,
        canCreateInvoice: false,
        subscription: null,
        freeUsage: { used: 0, limit: 3, canUseFreeTier: false },
      };
    }

    // Try to call the edge function
    try {
      const response = await supabase.functions.invoke('check-subscription', {});

      if (!response.data || !response.data.success) {
        throw new Error(response.error || response.data?.error || 'Failed to check subscription status');
      }

      return response.data.data;
    } catch (functionError) {
      console.error('Error checking subscription:', functionError);

      // If edge function fails, fallback to client-side behavior to not block usage
      return {
        isSubscribed: false,
        canCreateInvoice: true, // Allow invoice creation as fallback
        subscription: null,
        freeUsage: { 
          used: 0, 
          limit: 3, 
          canUseFreeTier: true 
        },
      };
    }
  } catch (error: any) {
    console.error('Error checking subscription:', error);
    throw error;
  }
};

export const updateUsage = async () => {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) throw new Error('You must be logged in to update usage');

    try {
      const response = await supabase.functions.invoke('update-usage', {});

      if (!response.data || !response.data.success) {
        throw new Error(response.error || response.data?.error || 'Failed to update usage');
      }

      return response.data;
    } catch (functionError) {
      console.error('Error invoking update-usage function:', functionError);
      // Silently fail so it doesn't block users
      return { success: true, data: { updated: false } };
    }
  } catch (error: any) {
    console.error('Error updating usage:', error);
    throw error;
  }
};
