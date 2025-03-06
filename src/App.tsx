
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import InvoiceHistory from './pages/InvoiceHistory';
import CreateInvoice from './pages/CreateInvoice';
import ViewInvoice from './pages/ViewInvoice';
import Settings from './pages/Settings';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { checkSupabaseConnection } from './lib/supabase';
import { Code } from './components/ui/code';
import { SettingsProvider } from './context/SettingsContext';

function App() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const queryClient = new QueryClient();

  useEffect(() => {
    const checkConnection = async () => {
      const connectionStatus = await checkSupabaseConnection();
      setIsConnected(connectionStatus);
    };

    checkConnection();
  }, []);

  const AuthRoute = ({ children }: { children: React.ReactNode }) => {
    const { isLoggedIn } = useAuth();
    return isLoggedIn ? <Navigate to="/dashboard" /> : children;
  };

  const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
    const { isLoggedIn } = useAuth();
    return isLoggedIn ? children : <Navigate to="/login" />;
  };

  if (isConnected === null) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Checking Supabase connection...</p>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="flex flex-col justify-center items-center h-screen p-4">
        <h1 className="text-2xl font-bold mb-4">Failed to Connect to Supabase</h1>
        <p className="text-gray-600 mb-4">
          It seems there's an issue connecting to your Supabase project. Please ensure that:
        </p>
        <ul className="list-disc pl-5 mb-4">
          <li>Your Supabase project is running.</li>
          <li>Your <code>.env</code> file contains the correct <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code>.</li>
          <li>Your local Supabase CLI is up to date.</li>
        </ul>
        <p className="text-gray-600">
          If you've made changes, restart your development server to apply the new environment variables.
        </p>
        <div className="mt-8">
          <Code>
            VITE_SUPABASE_URL=YOUR_SUPABASE_URL
            VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
          </Code>
        </div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <SettingsProvider>
        <QueryClientProvider client={queryClient}>
          <Router>
            <Routes>
              <Route
                path="/login"
                element={
                  <AuthRoute>
                    <Login />
                  </AuthRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <AuthRoute>
                    <Register />
                  </AuthRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <MainLayout>
                      <Dashboard />
                    </MainLayout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/invoice-history"
                element={
                  <PrivateRoute>
                    <MainLayout>
                      <InvoiceHistory />
                    </MainLayout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/create-invoice"
                element={
                  <PrivateRoute>
                    <CreateInvoice />
                  </PrivateRoute>
                }
              />
              <Route
                path="/view-invoice/:id"
                element={
                  <PrivateRoute>
                    <ViewInvoice />
                  </PrivateRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <PrivateRoute>
                    <Settings />
                  </PrivateRoute>
                }
              />
              <Route path="/" element={<Navigate to="/dashboard" />} />
            </Routes>
          </Router>
          <Toaster />
        </QueryClientProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}

export default App;
