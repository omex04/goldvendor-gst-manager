
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import LandingHeader from '@/components/landing/LandingHeader';
import LandingFooter from '@/components/landing/LandingFooter';
import { signIn } from '@/lib/supabase';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
      
      <div className="flex-grow flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
          {/* Left side - Welcome back content */}
          <div className="lg:col-span-2 space-y-6 text-center lg:text-left">
            <div>
              <h1 className="text-4xl font-bold text-gold-600 dark:text-gold-500">Welcome Back</h1>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                Log in to access your Gold GST Manager dashboard and manage your invoices
              </p>
            </div>
            
            <div className="bg-gold-100 dark:bg-gold-900/30 p-6 rounded-xl">
              <h3 className="font-medium text-gold-800 dark:text-gold-400 text-lg">New Features</h3>
              <ul className="mt-3 space-y-2">
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-gold-500"></span>
                  <span className="text-gray-700 dark:text-gray-300">Improved invoice templates</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-gold-500"></span>
                  <span className="text-gray-700 dark:text-gray-300">Enhanced reporting</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-gold-500"></span>
                  <span className="text-gray-700 dark:text-gray-300">Mobile optimization</span>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Right side - Login form */}
          <Card className="lg:col-span-3 dark:bg-gray-800 dark:border-gray-700 shadow-lg">
            <CardHeader className="pb-4">
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
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="dark:text-gray-300">Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email" 
                            placeholder="your.email@example.com"
                            className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
                          <Input
                            type="password" 
                            placeholder="••••••••"
                            className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter className="flex flex-col gap-4 pt-0">
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
          </Card>
        </div>
      </div>
      
      <LandingFooter />
    </div>
  );
};

export default Login;
