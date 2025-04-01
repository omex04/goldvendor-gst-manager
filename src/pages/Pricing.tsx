
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, X } from 'lucide-react';
import LandingHeader from '@/components/landing/LandingHeader';
import LandingFooter from '@/components/landing/LandingFooter';
import { Link, useNavigate } from 'react-router-dom';
import { plans, createSubscription } from '@/services/subscriptionService';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const Pricing = () => {
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubscribe = async (planId: string) => {
    try {
      if (!isAuthenticated) {
        toast.error('Please log in to subscribe');
        navigate('/login');
        return;
      }

      setIsLoading({ ...isLoading, [planId]: true });

      // Load Razorpay script
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        throw new Error('Failed to load Razorpay checkout. Please try again.');
      }

      // Create subscription order
      const orderData = await createSubscription(planId);

      // Open Razorpay checkout
      const options = {
        key: orderData.keyId,
        amount: orderData.amount * 100, // paise
        currency: orderData.currency,
        name: 'Gold GST Manager',
        description: `${plans.find(p => p.id === planId)?.name} Subscription`,
        order_id: orderData.orderId,
        handler: async function (response: any) {
          // Redirect to success page with params
          navigate(`/subscription/success?razorpay_payment_id=${response.razorpay_payment_id}&razorpay_order_id=${response.razorpay_order_id}&razorpay_signature=${response.razorpay_signature}&planId=${planId}`);
        },
        prefill: {
          name: 'Gold GST User',
        },
        theme: {
          color: '#B8860B',
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      console.error('Subscription error:', error);
      toast.error(error.message || 'Failed to start subscription process');
    } finally {
      setIsLoading({ ...isLoading, [planId]: false });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <LandingHeader />

      <div className="flex-grow container px-4 py-12 mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl font-bold text-gold-600 dark:text-gold-500">Pricing Plans</h1>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-400">
            Choose the perfect plan for your business needs
          </p>
        </div>

        {!isAuthenticated && (
          <Alert className="max-w-3xl mx-auto mb-8 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
            <AlertTitle>Create an account to subscribe</AlertTitle>
            <AlertDescription>
              You need to{' '}
              <Link to="/register" className="font-medium text-amber-600 dark:text-amber-400 hover:underline">
                create an account
              </Link>{' '}
              or{' '}
              <Link to="/login" className="font-medium text-amber-600 dark:text-amber-400 hover:underline">
                log in
              </Link>{' '}
              to subscribe to any plan.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-8 md:grid-cols-3">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className="flex flex-col transition-all hover:shadow-lg border-gold-100 dark:border-gray-700"
            >
              <CardHeader>
                <CardTitle className="text-xl text-gold-600 dark:text-gold-500">{plan.name}</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  {plan.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="mb-6">
                  <p className="text-3xl font-bold">₹{plan.price}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {plan.id === 'yearly' ? 'per year' : 'per month'}
                  </p>
                </div>
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full bg-gold-500 hover:bg-gold-600 dark:bg-gold-600 dark:hover:bg-gold-700 text-black transition-colors" 
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={isLoading[plan.id]}
                >
                  {isLoading[plan.id] ? 'Processing...' : 'Subscribe Now'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
            Free Trial
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Not ready to commit? No problem! Create an account and try our service with up to 3 free invoices before deciding on a subscription plan.
          </p>
          <div className="mt-6">
            <Button asChild variant="outline" className="mx-2">
              <Link to="/register">Sign Up Free</Link>
            </Button>
            <Button asChild className="mx-2 bg-gold-500 hover:bg-gold-600 dark:bg-gold-600 dark:hover:bg-gold-700 text-black transition-colors">
              <Link to="/login">Log In</Link>
            </Button>
          </div>
        </div>
      </div>

      <LandingFooter />
    </div>
  );
};

export default Pricing;
