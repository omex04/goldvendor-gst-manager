
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { checkSubscription } from '@/services/subscriptionService';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface SubscriptionStatus {
  isSubscribed: boolean;
  canCreateInvoice: boolean;
  subscription: any | null;
  freeUsage: {
    used: number;
    limit: number;
    canUseFreeTier: boolean;
  };
  isLoading: boolean;
  refreshSubscription: () => Promise<void>;
}

const defaultStatus: SubscriptionStatus = {
  isSubscribed: false,
  canCreateInvoice: true, // Default to true to prevent blocking new users
  subscription: null,
  freeUsage: {
    used: 0,
    limit: 3,
    canUseFreeTier: true,
  },
  isLoading: true,
  refreshSubscription: async () => {},
};

const SubscriptionContext = createContext<SubscriptionStatus>(defaultStatus);

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const [status, setStatus] = useState<Omit<SubscriptionStatus, 'refreshSubscription'>>(defaultStatus);
  const { isAuthenticated, user } = useAuth();

  const refreshSubscription = async () => {
    if (!isAuthenticated || !user) {
      setStatus({
        ...defaultStatus,
        isLoading: false,
      });
      return;
    }

    try {
      console.log("Refreshing subscription status for user:", user.id);
      const data = await checkSubscription();
      
      console.log("Subscription data received:", JSON.stringify(data));
      
      // Update subscription status based on response from edge function
      setStatus({
        isSubscribed: data.isSubscribed,
        // Always allow invoice creation if they haven't reached the limit
        canCreateInvoice: data.isSubscribed || 
                          (data.freeUsage && data.freeUsage.used < data.freeUsage.limit),
        subscription: data.subscription,
        freeUsage: data.freeUsage,
        isLoading: false,
      });
      
      // Show warning when user is getting close to free limit
      if (!data.isSubscribed && data.freeUsage && 
          data.freeUsage.used === data.freeUsage.limit - 1) {
        toast.warning("You have 1 free invoice remaining. Subscribe to create unlimited invoices.");
      }
    } catch (error) {
      console.error('Failed to check subscription status:', error);
      // Set permissive default values when there's an error checking subscription
      // to allow new users to create invoices
      setStatus({
        isSubscribed: false,
        canCreateInvoice: true, // Allow invoice creation by default for error cases
        subscription: null,
        freeUsage: {
          used: 0,
          limit: 3,
          canUseFreeTier: true,
        },
        isLoading: false,
      });
      
      toast.error('Unable to verify subscription status. Please try again later.');
    }
  };

  useEffect(() => {
    // Clear subscription status when authentication state changes
    if (!isAuthenticated) {
      setStatus({
        ...defaultStatus,
        isLoading: false,
      });
    }
  }, [isAuthenticated]);
  
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      // Increased delay to ensure auth is fully processed
      const timer = setTimeout(() => {
        refreshSubscription();
      }, 1000); // Further increased delay to 1000ms
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, user?.id]);

  return (
    <SubscriptionContext.Provider value={{ ...status, refreshSubscription }}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => useContext(SubscriptionContext);
