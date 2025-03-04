
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Database, Server } from 'lucide-react';
import { Link } from 'react-router-dom';
import { checkSupabaseConnection } from '@/lib/supabase';
import { toast } from 'sonner';

export const SupabaseSettings = () => {
  const [isConnected, setIsConnected] = React.useState<boolean | null>(null);
  const [isChecking, setIsChecking] = React.useState(false);

  const checkConnection = async () => {
    setIsChecking(true);
    try {
      const connected = await checkSupabaseConnection();
      setIsConnected(connected);
      if (connected) {
        toast.success('Successfully connected to Supabase');
      } else {
        toast.error('Could not connect to Supabase');
      }
    } catch (error) {
      console.error('Error checking Supabase connection:', error);
      setIsConnected(false);
      toast.error('Error checking Supabase connection');
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Server className="h-5 w-5 text-gold-500" />
          <CardTitle className="dark:text-white">Supabase Integration</CardTitle>
        </div>
        <CardDescription className="dark:text-gray-400">
          Connect your application to Supabase for live database and authentication
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 dark:text-gray-300">
        <p>
          Supabase provides backend services including authentication, database storage, and file storage.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <Button 
            variant="outline" 
            className="dark:border-gray-700 dark:hover:bg-gray-700"
            onClick={checkConnection}
            disabled={isChecking}
          >
            <Database className="mr-2 h-4 w-4" />
            {isChecking ? 'Checking connection...' : 'Check Connection'}
          </Button>
          
          <Button asChild className="bg-gold-500 hover:bg-gold-600 dark:bg-gold-600 dark:hover:bg-gold-700">
            <Link to="/supabase-guide">
              <Server className="mr-2 h-4 w-4" />
              Setup Guide
            </Link>
          </Button>
        </div>
        
        {isConnected !== null && (
          <div className={`mt-4 p-3 rounded ${isConnected ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400'}`}>
            {isConnected 
              ? 'Your application is successfully connected to Supabase!' 
              : 'Could not connect to Supabase. Please check your configuration.'}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
