
import React from 'react';
import { PageTransition } from '@/components/ui/PageTransition';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Code } from '@/components/ui/code';
import { Separator } from '@/components/ui/separator';

const SupabaseGuide = () => {
  return (
    <MainLayout>
      <PageTransition>
        <div className="space-y-6 max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold tracking-tight">Supabase Integration Guide</h1>
          <p className="text-muted-foreground">Follow these steps to connect your Gold GST Manager with Supabase for live authentication and database</p>
          
          <Alert className="bg-gold-50 dark:bg-gold-900/20 border-gold-200 dark:border-gold-800">
            <AlertTitle className="text-gold-800 dark:text-gold-400">Why Supabase?</AlertTitle>
            <AlertDescription className="text-gold-700 dark:text-gold-300">
              Supabase provides authentication, database, storage, and serverless functions - everything you need for your Gold GST Manager.
            </AlertDescription>
          </Alert>
          
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-xl dark:text-white">Step 1: Create a Supabase Project</CardTitle>
              <CardDescription className="dark:text-gray-400">
                Set up your Supabase project to get started
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 dark:text-gray-300">
              <ol className="list-decimal list-inside space-y-3">
                <li>Go to <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-gold-600 dark:text-gold-400 underline">Supabase.com</a> and sign in or create an account</li>
                <li>Create a new project and give it a name (e.g., "Gold GST Manager")</li>
                <li>Set a secure database password and note it down</li>
                <li>Choose a region closest to your users</li>
                <li>Wait for your project to be set up (this may take a few minutes)</li>
              </ol>
            </CardContent>
          </Card>
          
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-xl dark:text-white">Step 2: Get Your API Keys</CardTitle>
              <CardDescription className="dark:text-gray-400">
                Retrieve the credentials needed for connecting your app
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 dark:text-gray-300">
              <ol className="list-decimal list-inside space-y-3">
                <li>Once your project is ready, go to the project dashboard</li>
                <li>In the left sidebar, click on "Project Settings" and then "API"</li>
                <li>
                  Copy both the "Project URL" and "anon public" key<br />
                  <div className="my-2 rounded-md bg-gray-100 dark:bg-gray-900 p-3 text-sm">
                    <code>Project URL: https://xxxxxxxxxxxx.supabase.co</code><br />
                    <code>anon public key: eyJxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</code>
                  </div>
                </li>
              </ol>
            </CardContent>
          </Card>
          
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-xl dark:text-white">Step 3: Configure Your Environment</CardTitle>
              <CardDescription className="dark:text-gray-400">
                Add your Supabase credentials to your application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 dark:text-gray-300">
              <ol className="list-decimal list-inside space-y-3">
                <li>
                  Create or update the <code className="bg-gray-100 dark:bg-gray-900 px-1 py-0.5 rounded">.env</code> file in the root of your project
                </li>
                <li>
                  Add the following environment variables:
                  <div className="my-2 rounded-md bg-gray-100 dark:bg-gray-900 p-3 text-sm">
                    <code>VITE_SUPABASE_URL=your_project_url_here</code><br />
                    <code>VITE_SUPABASE_ANON_KEY=your_anon_key_here</code>
                  </div>
                </li>
                <li>Restart your development server if it's running</li>
              </ol>
            </CardContent>
          </Card>
          
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-xl dark:text-white">Step 4: Set Up Authentication</CardTitle>
              <CardDescription className="dark:text-gray-400">
                Configure authentication providers in Supabase
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 dark:text-gray-300">
              <ol className="list-decimal list-inside space-y-3">
                <li>In the Supabase dashboard, go to "Authentication" in the left sidebar</li>
                <li>Under "Providers", ensure "Email" is enabled</li>
                <li>Optional: Enable other providers like Google, GitHub, etc. if needed</li>
                <li>
                  Configure email templates:
                  <ul className="list-disc list-inside ml-5 mt-2">
                    <li>Go to "Email Templates"</li>
                    <li>Customize the invitation, confirmation, and password reset emails</li>
                  </ul>
                </li>
              </ol>
            </CardContent>
          </Card>
          
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-xl dark:text-white">Step 5: Create Database Tables</CardTitle>
              <CardDescription className="dark:text-gray-400">
                Set up your database schema for invoices and other data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 dark:text-gray-300">
              <p>Create the following tables in your Supabase database:</p>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">1. Customers Table</h3>
                  <div className="rounded-md bg-gray-100 dark:bg-gray-900 p-3 text-sm overflow-x-auto">
                    <pre>{`
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  gstin TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id)
);

-- Set up Row Level Security
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Create policy to restrict access to own data
CREATE POLICY "Users can only access their own customers"
  ON customers FOR ALL
  USING (auth.uid() = user_id);
                    `}</pre>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">2. Invoices Table</h3>
                  <div className="rounded-md bg-gray-100 dark:bg-gray-900 p-3 text-sm overflow-x-auto">
                    <pre>{`
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_number TEXT NOT NULL,
  date DATE NOT NULL,
  due_date DATE,
  customer_id UUID REFERENCES customers(id),
  status TEXT DEFAULT 'pending',
  payment_method TEXT,
  sub_total DECIMAL(10,2) NOT NULL,
  cgst_total DECIMAL(10,2) NOT NULL,
  sgst_total DECIMAL(10,2) NOT NULL,
  grand_total DECIMAL(10,2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id)
);

-- Set up Row Level Security
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Create policy to restrict access to own data
CREATE POLICY "Users can only access their own invoices"
  ON invoices FOR ALL
  USING (auth.uid() = user_id);
                    `}</pre>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">3. Invoice Items Table</h3>
                  <div className="rounded-md bg-gray-100 dark:bg-gray-900 p-3 text-sm overflow-x-auto">
                    <pre>{`
CREATE TABLE invoice_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity DECIMAL(10,2) NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  cgst_rate DECIMAL(5,2) NOT NULL,
  sgst_rate DECIMAL(5,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up Row Level Security
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;

-- Create policy to restrict access based on parent invoice
CREATE POLICY "Users can only access their own invoice items"
  ON invoice_items FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM invoices
      WHERE invoices.id = invoice_items.invoice_id
      AND invoices.user_id = auth.uid()
    )
  );
                    `}</pre>
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground mt-4">
                You can execute these SQL statements in the SQL Editor in the Supabase Dashboard.
              </p>
            </CardContent>
          </Card>
          
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-xl dark:text-white">Step 6: Test Your Connection</CardTitle>
              <CardDescription className="dark:text-gray-400">
                Verify that your application can connect to Supabase
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 dark:text-gray-300">
              <ol className="list-decimal list-inside space-y-3">
                <li>Register a new user through your application</li>
                <li>Verify the user appears in the "Authentication" > "Users" section in Supabase</li>
                <li>Test creating an invoice and check that data is stored in your database tables</li>
              </ol>
            </CardContent>
          </Card>
          
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-xl dark:text-white">Deployment Considerations</CardTitle>
              <CardDescription className="dark:text-gray-400">
                Important things to remember when deploying your application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 dark:text-gray-300">
              <ul className="list-disc list-inside space-y-3">
                <li>Always keep your Supabase keys secure and never expose them in client-side code</li>
                <li>Configure CORS in Supabase if you're hosting your frontend on a different domain</li>
                <li>Ensure you set environment variables correctly on your production hosting platform</li>
                <li>Consider using different Supabase projects for development and production</li>
              </ul>
            </CardContent>
          </Card>
          
          <div className="text-center">
            <p className="text-muted-foreground">
              Need more help? Check out the <a href="https://supabase.com/docs" target="_blank" rel="noopener noreferrer" className="text-gold-600 dark:text-gold-400 underline">Supabase documentation</a>.
            </p>
          </div>
        </div>
      </PageTransition>
    </MainLayout>
  );
};

export default SupabaseGuide;
