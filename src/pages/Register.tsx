
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Register = () => {
  const [formData, setFormData] = useState({
    businessName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real app, this would be replaced with actual registration logic
      // For now, simulate a successful registration with a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (error) {
      toast.error('Registration failed. Please try again.');
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gold-600">Gold GST Manager</h1>
          <p className="text-gray-600 mt-2">Create a new account</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Register</CardTitle>
            <CardDescription>
              Create an account to get started
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleRegister}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name</Label>
                <Input
                  id="businessName"
                  name="businessName"
                  placeholder="Your Business Name"
                  value={formData.businessName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full bg-gold-500 hover:bg-gold-600" 
                disabled={isLoading}
              >
                {isLoading ? 'Creating account...' : 'Create account'}
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Button variant="link" className="p-0 font-normal h-auto" onClick={() => navigate('/login')}>
              Log in
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
