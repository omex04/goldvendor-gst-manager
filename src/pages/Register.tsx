
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import LandingHeader from '@/components/landing/LandingHeader';
import LandingFooter from '@/components/landing/LandingFooter';
import { signUp } from '@/lib/supabase';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, refreshUser } = useAuth();

  useEffect(() => {
    // If already authenticated, redirect to dashboard
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !fullName) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await signUp(email, password, { 
        name: fullName,
        businessName 
      });
      
      if (!result.success) {
        throw new Error(result.error || 'Registration failed');
      }
      
      await refreshUser(); // Update auth context
      toast.success('Registration successful!');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Registration failed. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <LandingHeader />
      
      <div className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gold-600 dark:text-gold-500">Gold GST Manager</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Create an account</p>
          </div>
          
          <Card className="dark:bg-gray-800 dark:border-gray-700 transition-all hover:shadow-md">
            <CardHeader>
              <CardTitle className="dark:text-white">Sign up</CardTitle>
              <CardDescription className="dark:text-gray-400">
                Create a new account to get started
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleRegister}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="dark:text-gray-300">Full Name *</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors focus:border-gold-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="business" className="dark:text-gray-300">Business Name (Optional)</Label>
                  <Input
                    id="business"
                    type="text"
                    placeholder="Gold Jewelry Shop"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors focus:border-gold-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="dark:text-gray-300">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors focus:border-gold-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="dark:text-gray-300">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors focus:border-gold-500"
                    minLength={6}
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">Password must be at least 6 characters</p>
                </div>
                
                <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-md transition-colors">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    By signing up, you agree to our <Link to="/terms" className="underline hover:text-blue-800 dark:hover:text-blue-200">Terms of Service</Link> and <Link to="/privacy" className="underline hover:text-blue-800 dark:hover:text-blue-200">Privacy Policy</Link>
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button 
                  type="submit" 
                  className="w-full bg-gold-500 hover:bg-gold-600 dark:bg-gold-600 dark:hover:bg-gold-700 text-black transition-colors" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </Button>
                <div className="text-center w-full">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Already have an account?{' '}
                    <Link to="/login" className="text-gold-600 dark:text-gold-500 hover:underline transition-colors">
                      Log in
                    </Link>
                  </p>
                </div>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
      
      <LandingFooter />
    </div>
  );
};

export default Register;
