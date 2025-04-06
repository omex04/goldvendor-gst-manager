
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import LandingHeader from '@/components/landing/LandingHeader';
import LandingFooter from '@/components/landing/LandingFooter';
import { signUp } from '@/lib/supabase';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { ArrowRight, UserPlus } from 'lucide-react';

const formSchema = z.object({
  fullName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  businessName: z.string().optional(),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, refreshUser } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      businessName: "",
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
      const result = await signUp(values.email, values.password, { 
        name: values.fullName,
        businessName: values.businessName || undefined
      });
      
      if (!result.success) {
        throw new Error(result.error || 'Registration failed');
      }
      
      toast.success('Registration successful!');
      
      // Wait a moment for DB triggers to complete
      setTimeout(async () => {
        await refreshUser();
        navigate('/dashboard');
      }, 1000);
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
      
      <div className="flex-grow flex items-center justify-center p-4 md:p-8">
        <Card className="w-full max-w-6xl shadow-lg overflow-hidden dark:bg-gray-800 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left side - Form */}
            <div className="p-6">
              <CardHeader className="pb-4 px-0">
                <div className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5 text-gold-500" />
                  <CardTitle className="dark:text-white text-2xl">Create your account</CardTitle>
                </div>
                <CardDescription className="dark:text-gray-400">
                  Enter your details to get started with Gold GST Manager
                </CardDescription>
              </CardHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <CardContent className="space-y-4 px-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="dark:text-gray-300">Full Name *</FormLabel>
                            <FormControl>
                              <input
                                type="text" 
                                placeholder="John Doe"
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
                        name="businessName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="dark:text-gray-300">Business Name (Optional)</FormLabel>
                            <FormControl>
                              <input
                                type="text" 
                                placeholder="Gold Jewelry Shop"
                                className="w-full px-4 py-2 rounded-md border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="dark:text-gray-300">Email *</FormLabel>
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
                          <FormLabel className="dark:text-gray-300">Password *</FormLabel>
                          <FormControl>
                            <input
                              type="password" 
                              placeholder="••••••••"
                              className="w-full px-4 py-2 rounded-md border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                              {...field}
                            />
                          </FormControl>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Password must be at least 6 characters</p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-md">
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        By signing up, you agree to our <Link to="/terms" className="underline hover:text-blue-800 dark:hover:text-blue-200">Terms of Service</Link> and <Link to="/privacy" className="underline hover:text-blue-800 dark:hover:text-blue-200">Privacy Policy</Link>
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-4 pt-0 px-0">
                    <Button 
                      type="submit" 
                      className="w-full bg-gold-500 hover:bg-gold-600 dark:bg-gold-600 dark:hover:bg-gold-700 text-black flex items-center justify-center gap-2" 
                      disabled={isLoading}
                    >
                      {isLoading ? 'Creating Account...' : 'Create Account'}
                      {!isLoading && <ArrowRight className="h-4 w-4" />}
                    </Button>
                    
                    <div className="text-center w-full">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Already have an account?{' '}
                        <Link to="/login" className="text-gold-600 dark:text-gold-500 hover:underline">
                          Log in
                        </Link>
                      </p>
                    </div>
                  </CardFooter>
                </form>
              </Form>
            </div>
            
            {/* Right side - Information */}
            <div className="bg-gradient-to-r from-gold-500 to-gold-600 p-8 flex flex-col justify-between text-black">
              <div>
                <h2 className="text-3xl font-bold mb-4">Gold GST Manager</h2>
                <p className="text-lg mb-6">
                  Simplify your GST filing and management for gold and jewelry businesses.
                </p>
                
                <div className="bg-white/20 p-6 rounded-xl backdrop-blur-sm">
                  <h3 className="font-medium text-xl mb-4">Why Choose Us?</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3">
                      <div className="h-6 w-6 rounded-full bg-white flex items-center justify-center">
                        <span className="text-gold-600">✓</span>
                      </div>
                      <span>Easy GST calculation</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="h-6 w-6 rounded-full bg-white flex items-center justify-center">
                        <span className="text-gold-600">✓</span>
                      </div>
                      <span>Professional invoice generation</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="h-6 w-6 rounded-full bg-white flex items-center justify-center">
                        <span className="text-gold-600">✓</span>
                      </div>
                      <span>HSN code management</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="h-6 w-6 rounded-full bg-white flex items-center justify-center">
                        <span className="text-gold-600">✓</span>
                      </div>
                      <span>Detailed reporting and analytics</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-10 bg-black/10 p-4 rounded-lg">
                <p className="italic text-sm">
                  "Gold GST Manager has transformed how we handle our invoicing and tax filing. 
                  The time saved is incredible!" — Rajesh Jewelers
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
      
      <LandingFooter />
    </div>
  );
};

export default Register;
