
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { ArrowRight } from 'lucide-react';

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
      
      <div className="flex-grow flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
          {/* Left side - Welcome content */}
          <div className="lg:col-span-2 space-y-6 text-center lg:text-left">
            <div>
              <h1 className="text-4xl font-bold text-gold-600 dark:text-gold-500">Gold GST Manager</h1>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                Simplify your GST filing and management for gold and jewelry businesses.
              </p>
            </div>
            
            <div className="bg-gold-100 dark:bg-gold-900/30 p-6 rounded-xl">
              <h3 className="font-medium text-gold-800 dark:text-gold-400 text-lg">Why Choose Us?</h3>
              <ul className="mt-3 space-y-2">
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-gold-500"></span>
                  <span className="text-gray-700 dark:text-gray-300">Easy GST calculation</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-gold-500"></span>
                  <span className="text-gray-700 dark:text-gray-300">Professional invoice generation</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-gold-500"></span>
                  <span className="text-gray-700 dark:text-gray-300">HSN code management</span>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Right side - Registration form */}
          <Card className="lg:col-span-3 dark:bg-gray-800 dark:border-gray-700 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="dark:text-white text-2xl">Create your account</CardTitle>
              <CardDescription className="dark:text-gray-400">
                Enter your details to get started with Gold GST Manager
              </CardDescription>
            </CardHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="dark:text-gray-300">Full Name *</FormLabel>
                          <FormControl>
                            <Input
                              type="text" 
                              placeholder="John Doe"
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
                      name="businessName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="dark:text-gray-300">Business Name (Optional)</FormLabel>
                          <FormControl>
                            <Input
                              type="text" 
                              placeholder="Gold Jewelry Shop"
                              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
                        <FormLabel className="dark:text-gray-300">Password *</FormLabel>
                        <FormControl>
                          <Input
                            type="password" 
                            placeholder="••••••••"
                            className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
                <CardFooter className="flex flex-col gap-4 pt-0">
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
          </Card>
        </div>
      </div>
      
      <LandingFooter />
    </div>
  );
};

export default Register;
