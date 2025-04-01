
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import LandingHeader from '@/components/landing/LandingHeader';
import LandingFooter from '@/components/landing/LandingFooter';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  useEffect(() => {
    // Check if already authenticated
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate('/dashboard');
      }
    };
    
    checkAuth();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      await refreshUser(); // Update auth context
      toast.success('Login successful');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Login failed. Please check your credentials.');
      console.error('Login error:', error);
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
            <p className="text-gray-600 dark:text-gray-400 mt-2">Login to your account</p>
          </div>
          
          <Card className="dark:bg-gray-800 dark:border-gray-700 transition-all hover:shadow-md">
            <CardHeader>
              <CardTitle className="dark:text-white">Login</CardTitle>
              <CardDescription className="dark:text-gray-400">
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleLogin}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="dark:text-gray-300">Email</Label>
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
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="dark:text-gray-300">Password</Label>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors focus:border-gold-500"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button 
                  type="submit" 
                  className="w-full bg-gold-500 hover:bg-gold-600 dark:bg-gold-600 dark:hover:bg-gold-700 text-black transition-colors" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Logging in...' : 'Log in'}
                </Button>
                <div className="text-center w-full">
                  <Link to="/" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gold-600 dark:hover:text-gold-500 transition-colors">
                    Back to home
                  </Link>
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

export default Login;
