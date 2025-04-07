
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { signUp } from '@/lib/localAuth';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const formSchema = z.object({
  fullName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  businessName: z.string().optional(),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

type RegisterFormProps = {
  onSuccess?: () => void;
};

const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      businessName: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setApiError(null);
    
    try {
      const result = await signUp(
        values.email, 
        values.password, 
        { name: values.fullName }
      );
      
      toast.error('Registration is disabled. Please use the default credentials.');
      setApiError('Registration is disabled. Please use the default login credentials.');
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (error: any) {
      console.error('Registration error:', error);
      setApiError('Registration is disabled. Please use the default login.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {apiError && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-300 rounded-md">
          {apiError}
        </div>
      )}
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-4">
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
          </div>
          <div className="flex flex-col gap-4 pt-4">
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
          </div>
        </form>
      </Form>
    </>
  );
};

export default RegisterForm;
