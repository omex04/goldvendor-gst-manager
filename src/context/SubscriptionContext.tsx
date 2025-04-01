
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { checkSubscription } from '@/services/subscriptionService';
import { useAuth } from '@/context/AuthContext';

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
      setStatus({
        isSubscribed: data.isSubscribed,
        canCreateInvoice: data.canCreateInvoice,
        subscription: data.subscription,
        freeUsage: data.freeUsage,
        isLoading: false,
      });
    } catch (error) {
      console.error('Failed to check subscription status:', error);
      setStatus({
        ...defaultStatus,
        isLoading: false,
      });
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      refreshSubscription();
    } else {
      setStatus({
        ...defaultStatus,
        isLoading: false,
      });
    }
  }, [isAuthenticated, user?.id]);

  return (
    <SubscriptionContext.Provider value={{ ...status, refreshSubscription }}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => useContext(SubscriptionContext);
