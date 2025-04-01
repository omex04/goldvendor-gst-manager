
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle } from 'lucide-react';
import { verifyPayment } from '@/services/subscriptionService';
import { toast } from 'sonner';
import LandingHeader from '@/components/landing/LandingHeader';
import LandingFooter from '@/components/landing/LandingFooter';

const SubscriptionSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const verifySubscription = async () => {
      try {
        const razorpay_payment_id = searchParams.get('razorpay_payment_id');
        const razorpay_order_id = searchParams.get('razorpay_order_id');
        const razorpay_signature = searchParams.get('razorpay_signature');
        const planId = searchParams.get('planId');

        if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !planId) {
          throw new Error('Missing payment verification parameters');
        }

        await verifyPayment({
          razorpay_payment_id,
          razorpay_order_id,
          razorpay_signature,
          planId
        });

        setIsSuccess(true);
      } catch (error: any) {
        console.error('Verification error:', error);
        toast.error(error.message || 'Failed to verify your subscription');
        setIsSuccess(false);
      } finally {
        setIsVerifying(false);
      }
    };

    verifySubscription();
  }, [searchParams]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <LandingHeader />
      
      <div className="flex-grow flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md dark:bg-gray-800 dark:border-gray-700 transition-all hover:shadow-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl dark:text-white">
              {isVerifying ? 'Verifying Payment' : isSuccess ? 'Payment Successful!' : 'Payment Verification Failed'}
            </CardTitle>
            <CardDescription className="dark:text-gray-400">
              {isVerifying 
                ? 'Please wait while we verify your payment...' 
                : isSuccess 
                  ? 'Your subscription has been activated successfully.' 
                  : 'We encountered an issue while verifying your payment.'}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="flex flex-col items-center justify-center py-8">
            {isVerifying ? (
              <Loader2 className="h-16 w-16 text-gold-500 animate-spin" />
            ) : isSuccess ? (
              <CheckCircle className="h-16 w-16 text-green-500" />
            ) : (
              <div className="flex flex-col items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="15" y1="9" x2="9" y2="15"></line>
                  <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
                <p className="mt-4 text-center text-gray-600 dark:text-gray-400">
                  Please contact support if you believe this is an error.
                </p>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-3">
            {!isVerifying && (
              <>
                <Button 
                  onClick={() => navigate('/dashboard')} 
                  className="w-full bg-gold-500 hover:bg-gold-600 dark:bg-gold-600 dark:hover:bg-gold-700 text-black transition-colors"
                >
                  {isSuccess ? 'Go to Dashboard' : 'Try Again'}
                </Button>
                
                {!isSuccess && (
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/pricing')}
                    className="w-full"
                  >
                    Back to Pricing
                  </Button>
                )}
              </>
            )}
          </CardFooter>
        </Card>
      </div>
      
      <LandingFooter />
    </div>
  );
};

export default SubscriptionSuccess;
