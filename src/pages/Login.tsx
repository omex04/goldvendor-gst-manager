
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// Sample credentials for testing
const SAMPLE_CREDENTIALS = {
  email: 'demo@example.com',
  password: 'password123'
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Sample authentication logic for demo purposes
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if credentials match our sample ones
      if (email === SAMPLE_CREDENTIALS.email && password === SAMPLE_CREDENTIALS.password) {
        // Store authentication state
        localStorage.setItem('isAuthenticated', 'true');
        
        toast.success('Login successful! Welcome to Gold GST Manager');
        navigate('/');
      } else {
        toast.error('Invalid credentials. Please try again.');
        toast.info(`Hint: Use ${SAMPLE_CREDENTIALS.email} / ${SAMPLE_CREDENTIALS.password}`, {
          duration: 5000
        });
      }
    } catch (error) {
      toast.error('Login failed. Please check your credentials.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gold-600">Gold GST Manager</h1>
          <p className="text-gray-600 mt-2">Login to your account</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Button variant="link" className="px-0 font-normal h-auto" type="button">
                    Forgot password?
                  </Button>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="pt-2">
                <div className="bg-slate-100 p-3 rounded text-sm">
                  <p className="font-medium">Demo Credentials:</p>
                  <p>Email: {SAMPLE_CREDENTIALS.email}</p>
                  <p>Password: {SAMPLE_CREDENTIALS.password}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full bg-gold-500 hover:bg-gold-600" 
                disabled={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Log in'}
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Button variant="link" className="p-0 font-normal h-auto" onClick={() => navigate('/register')}>
              Create an account
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
