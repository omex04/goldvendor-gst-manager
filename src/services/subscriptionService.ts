
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

    console.log('Creating subscription for plan:', plan.id);
    
    const response = await supabase.functions.invoke('create-subscription', {
      body: {
        planId: plan.id,
        planName: plan.name,
        amount: plan.price,
        currency: 'INR'
      },
    });

    console.log('Response from create-subscription:', response);

    if (!response.data || !response.data.success) {
      const errorMessage = (response.error || (response.data && response.data.error) || 'Failed to create subscription');
      console.error('Subscription creation error:', errorMessage);
      throw new Error(errorMessage);
    }

    // Initialize Razorpay for payment
    if (typeof window.Razorpay === 'undefined') {
      throw new Error('Razorpay SDK not loaded');
    }

    const options = {
      key: response.data.data.key_id,
      amount: response.data.data.amount,
      currency: response.data.data.currency,
      name: "Gold GST Manager",
      description: `Subscription for ${plan.name}`,
      order_id: response.data.data.order_id,
      handler: function (response: any) {
        console.log('Payment successful:', response);
        // Verify payment using the verify-payment function
        verifyPayment({
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
          planId: plan.id
        }).then(verificationResult => {
          console.log('Payment verification result:', verificationResult);
          window.location.href = '/subscription/success';
        }).catch(err => {
          console.error('Payment verification error:', err);
          toast.error('Payment verification failed');
        });
      },
      prefill: {
        email: sessionData.session.user.email || '',
      },
      theme: {
        color: "#c8a951", // Gold color for branding
      },
      modal: {
        ondismiss: function() {
          console.log('Payment canceled by user');
          toast.info('Payment canceled');
        }
      }
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
    
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
      console.log('Checking subscription status...');
      const response = await supabase.functions.invoke('check-subscription', {});
      console.log('Subscription check response:', response);

      if (!response.data || !response.data.success) {
        console.error('Subscription check failed:', response.error || response.data?.error);
        throw new Error(response.error || response.data?.error || 'Failed to check subscription status');
      }

      return response.data.data;
    } catch (functionError) {
      console.error('Error checking subscription:', functionError);

      // If edge function fails, fallback to client-side behavior but don't allow 
      // unauthorized usage
      return {
        isSubscribed: false,
        canCreateInvoice: false, // Don't allow invoice creation as fallback
        subscription: null,
        freeUsage: { 
          used: 3, // Assume limit reached to prevent unauthorized usage
          limit: 3, 
          canUseFreeTier: false 
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
      console.log('Updating usage...');
      const response = await supabase.functions.invoke('update-usage', {});
      console.log('Update usage response:', response);

      // Check if the function returned an error due to usage limits
      if (!response.data?.success) {
        console.error('Error updating usage:', response.error || response.data?.error);
        return { 
          success: false, 
          error: response.data?.error || 'You have reached your usage limit. Please subscribe to continue.'
        };
      }

      return { success: true, data: response.data };
    } catch (functionError: any) {
      console.error('Error invoking update-usage function:', functionError);
      return { 
        success: false, 
        error: functionError.message || 'Failed to update usage. Please try again.' 
      };
    }
  } catch (error: any) {
    console.error('Error updating usage:', error);
    return { success: false, error: error.message };
  }
};

// Add Razorpay type definition
declare global {
  interface Window {
    Razorpay: any;
  }
}
