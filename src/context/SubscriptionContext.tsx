
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
  canCreateInvoice: false,
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
      const data = await checkSubscription();
      
      // Ensure we're properly setting canCreateInvoice based on subscription status
      // or free tier availability
      setStatus({
        isSubscribed: data.isSubscribed,
        canCreateInvoice: data.isSubscribed || 
                          (data.freeUsage && data.freeUsage.canUseFreeTier),
        subscription: data.subscription,
        freeUsage: data.freeUsage,
        isLoading: false,
      });
      
      // Show warning when user is close to free limit
      if (!data.isSubscribed && data.freeUsage && 
          data.freeUsage.used === 2 && data.freeUsage.limit === 3) {
        toast.warning("You have 1 free invoice remaining. Subscribe to create unlimited invoices.");
      }
    } catch (error) {
      console.error('Failed to check subscription status:', error);
      // Set restrictive default values when there's an error checking subscription
      // to prevent unauthorized access
      setStatus({
        isSubscribed: false,
        canCreateInvoice: false, // Don't allow invoice creation on error
        subscription: null,
        freeUsage: {
          used: 0,
          limit: 3,
          canUseFreeTier: false,
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
      // Small delay to ensure auth is fully processed
      const timer = setTimeout(() => {
        refreshSubscription();
      }, 500);
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
