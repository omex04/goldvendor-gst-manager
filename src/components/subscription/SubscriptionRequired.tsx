
import React, { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { useSubscription } from '@/context/SubscriptionContext';
import { Progress } from '@/components/ui/progress';

interface SubscriptionRequiredProps {
  children: ReactNode;
}

const SubscriptionRequired = ({ children }: SubscriptionRequiredProps) => {
  const { isSubscribed, canCreateInvoice, freeUsage, isLoading } = useSubscription();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-64">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Checking subscription status...</p>
        </div>
      </div>
    );
  }

  if (canCreateInvoice) {
    // User can create invoices (either free tier or subscribed)
    return <>{children}</>;
  }

  // User has used all free invoices and is not subscribed
  return (
    <Card className="w-full max-w-3xl mx-auto shadow-lg border-gold-100 dark:border-gray-700 transition-all hover:shadow-xl">
      <CardHeader>
        <div className="flex items-center mb-2">
          <AlertTriangle className="w-6 h-6 text-amber-500 mr-2" />
          <CardTitle className="text-xl">Subscription Required</CardTitle>
        </div>
        <CardDescription>
          You've used all your free invoices. Subscribe to a plan to continue using Gold GST Manager.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Free invoices used</span>
            <span className="font-medium">{freeUsage.used} / {freeUsage.limit}</span>
          </div>
          <Progress value={(freeUsage.used / freeUsage.limit) * 100} className="h-2 bg-gray-200 dark:bg-gray-700" />
        </div>
        
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md border border-blue-100 dark:border-blue-800">
          <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Benefits of a subscription:</h3>
          <ul className="text-sm text-blue-700 dark:text-blue-400 list-disc list-inside space-y-1">
            <li>Create unlimited invoices based on your plan</li>
            <li>Access to advanced reporting features</li>
            <li>Priority customer support</li>
            <li>GST compliant billing</li>
          </ul>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={() => navigate('/pricing')}
          className="w-full sm:w-auto bg-gold-500 hover:bg-gold-600 dark:bg-gold-600 dark:hover:bg-gold-700 text-black transition-colors"
        >
          View Pricing Plans
        </Button>
        <Button
          variant="outline"
          onClick={() => navigate('/dashboard')}
          className="w-full sm:w-auto"
        >
          Back to Dashboard
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SubscriptionRequired;
