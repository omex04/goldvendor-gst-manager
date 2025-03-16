
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import LandingHeader from '@/components/landing/LandingHeader';
import LandingFooter from '@/components/landing/LandingFooter';

const Register = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <LandingHeader />
      
      <div className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gold-600 dark:text-gold-500">Gold GST Manager</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Registration Notice</p>
          </div>
          
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="dark:text-white">Registration Disabled</CardTitle>
              <CardDescription className="dark:text-gray-400">
                This application is configured for single-user mode
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded-md text-yellow-800 dark:text-yellow-200 mb-4">
                <p>Registration is disabled as this application is configured for single-user mode.</p>
                <p className="mt-2">Please use the default administrator account to access the system.</p>
              </div>
              
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-md">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <strong>Default credentials:</strong><br />
                  Email: admin@goldgst.com<br />
                  Password: gold123
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                asChild
                className="w-full bg-gold-500 hover:bg-gold-600 dark:bg-gold-600 dark:hover:bg-gold-700"
              >
                <Link to="/login">Back to Login</Link>
              </Button>
              <div className="text-center w-full">
                <Link to="/" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gold-600 dark:hover:text-gold-500">
                  Back to home
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
      
      <LandingFooter />
    </div>
  );
};

export default Register;
