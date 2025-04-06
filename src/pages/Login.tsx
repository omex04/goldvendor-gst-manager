
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import LandingHeader from '@/components/landing/LandingHeader';
import LandingFooter from '@/components/landing/LandingFooter';
import { signIn } from '@/lib/supabase';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { ArrowRight, KeyRound } from 'lucide-react';

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, refreshUser } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    // If already authenticated, redirect to dashboard
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    
    try {
      const result = await signIn(values.email, values.password);
      
      if (!result.success) {
        throw new Error(result.error || 'Login failed');
      }
      
      await refreshUser();
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
      
      <div className="flex-grow flex items-center justify-center p-4 md:p-8">
        <Card className="w-full max-w-6xl shadow-lg overflow-hidden dark:bg-gray-800 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left side - Information */}
            <div className="bg-gradient-to-r from-gold-600 to-gold-500 p-8 flex flex-col justify-between text-black">
              <div>
                <h2 className="text-3xl font-bold mb-4">Welcome Back</h2>
                <p className="text-lg mb-6">
                  Log in to access your Gold GST Manager dashboard and manage your invoices
                </p>
                
                <div className="bg-white/20 p-6 rounded-xl backdrop-blur-sm">
                  <h3 className="font-medium text-xl mb-4">New Features</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3">
                      <div className="h-6 w-6 rounded-full bg-white flex items-center justify-center">
                        <span className="text-gold-600">✓</span>
                      </div>
                      <span>Improved invoice templates</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="h-6 w-6 rounded-full bg-white flex items-center justify-center">
                        <span className="text-gold-600">✓</span>
                      </div>
                      <span>Enhanced reporting</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="h-6 w-6 rounded-full bg-white flex items-center justify-center">
                        <span className="text-gold-600">✓</span>
                      </div>
                      <span>Mobile optimization</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="h-6 w-6 rounded-full bg-white flex items-center justify-center">
                        <span className="text-gold-600">✓</span>
                      </div>
                      <span>Real-time GST rate updates</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-10 bg-black/10 p-4 rounded-lg">
                <p className="italic text-sm">
                  "The dashboard analytics have helped us make better business decisions month after month." — Golden Touch Jewelers
                </p>
              </div>
            </div>
            
            {/* Right side - Login form */}
            <div className="p-6 flex flex-col justify-center">
              <CardHeader className="pb-4 px-0">
                <div className="flex items-center gap-2">
                  <KeyRound className="h-5 w-5 text-gold-500" />
                  <CardTitle className="dark:text-white text-2xl">Login to your account</CardTitle>
                </div>
                <CardDescription className="dark:text-gray-400">
                  Enter your credentials to access your dashboard
                </CardDescription>
              </CardHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <CardContent className="space-y-4 px-0">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="dark:text-gray-300">Email</FormLabel>
                          <FormControl>
                            <input
                              type="email" 
                              placeholder="your.email@example.com"
                              className="w-full px-4 py-2 rounded-md border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="dark:text-gray-300">Password</FormLabel>
                          <FormControl>
                            <input
                              type="password" 
                              placeholder="••••••••"
                              className="w-full px-4 py-2 rounded-md border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                  <CardFooter className="flex flex-col gap-4 pt-4 px-0">
                    <Button 
                      type="submit" 
                      className="w-full bg-gold-500 hover:bg-gold-600 dark:bg-gold-600 dark:hover:bg-gold-700 text-black flex items-center justify-center gap-2" 
                      disabled={isLoading}
                    >
                      {isLoading ? 'Logging in...' : 'Log in'}
                      {!isLoading && <ArrowRight className="h-4 w-4" />}
                    </Button>
                    
                    <div className="grid grid-cols-2 gap-4 w-full">
                      <Link to="/" className="text-sm text-center text-gray-600 dark:text-gray-400 hover:text-gold-600 dark:hover:text-gold-500">
                        Back to home
                      </Link>
                      
                      <div className="text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          No account?{' '}
                          <Link to="/register" className="text-gold-600 dark:text-gold-500 hover:underline">
                            Sign up
                          </Link>
                        </p>
                      </div>
                    </div>
                  </CardFooter>
                </form>
              </Form>
            </div>
          </div>
        </Card>
      </div>
      
      <LandingFooter />
    </div>
  );
};

export default Login;
