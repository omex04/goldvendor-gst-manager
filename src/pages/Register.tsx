
import React, { useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import LandingHeader from '@/components/landing/LandingHeader';
import LandingFooter from '@/components/landing/LandingFooter';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import RegisterForm from '@/components/auth/RegisterForm';
import RegisterHeader from '@/components/auth/RegisterHeader';
import RegisterBenefits from '@/components/auth/RegisterBenefits';

const Register = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
    
    toast.info('Registration is disabled. Please use the default login: admin@goldgst.com / gold123');
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <LandingHeader />
      
      <div className="flex-grow flex items-center justify-center p-4 md:p-8">
        <Card className="w-full max-w-6xl shadow-lg overflow-hidden dark:bg-gray-800 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-6">
              <CardHeader className="px-0">
                <RegisterHeader />
              </CardHeader>
              
              <CardContent className="px-0">
                <RegisterForm />
              </CardContent>
              
              <CardFooter className="px-0">
                {/* Footer content if needed */}
              </CardFooter>
            </div>
            
            <RegisterBenefits />
          </div>
        </Card>
      </div>
      
      <LandingFooter />
    </div>
  );
};

export default Register;
