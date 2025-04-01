
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { useSubscription } from '@/context/SubscriptionContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Clock, Check, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const SubscriptionStatus = () => {
  const { isSubscribed, freeUsage, subscription, isLoading } = useSubscription();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <Badge variant="outline" className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
        Loading...
      </Badge>
    );
  }

  if (isSubscribed) {
    const validUntil = subscription ? new Date(subscription.valid_until) : null;
    const formatDate = (date: Date) => {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    };

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 hover:bg-green-200 cursor-help">
              <Check className="w-3 h-3 mr-1" />
              Subscribed
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>Active subscription until {validUntil ? formatDate(validUntil) : 'N/A'}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // Free tier with remaining invoices
  if (freeUsage.canUseFreeTier) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 hover:bg-blue-200 cursor-help">
              <Clock className="w-3 h-3 mr-1" />
              Free Trial
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p className="mb-2">You have used {freeUsage.used} of {freeUsage.limit} free invoices</p>
            <Button 
              size="sm" 
              className="w-full bg-gold-500 hover:bg-gold-600 text-black text-xs"
              onClick={() => navigate('/pricing')}
            >
              Upgrade Now
            </Button>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // Free tier with no remaining invoices
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300 hover:bg-amber-200 cursor-help">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Upgrade Needed
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p className="mb-2">You've used all free invoices. Subscribe to continue.</p>
          <Button 
            size="sm" 
            className="w-full bg-gold-500 hover:bg-gold-600 text-black text-xs"
            onClick={() => navigate('/pricing')}
          >
            See Plans
          </Button>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default SubscriptionStatus;
