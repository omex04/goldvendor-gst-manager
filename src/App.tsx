import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SubscriptionProvider } from './context/SubscriptionContext';
import Login from './pages/Login';
import Register from './pages/Register';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import InvoiceHistory from './pages/InvoiceHistory';
import CreateInvoice from './pages/CreateInvoice';
import ViewInvoice from './pages/ViewInvoice';
import Settings from './pages/Settings';
import LandingPage from './pages/LandingPage';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions';
import Pricing from './pages/Pricing';
import SubscriptionSuccess from './pages/SubscriptionSuccess';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { SettingsProvider } from './context/SettingsContext';
import { ThemeProvider } from './components/ui/theme-provider';
import { checkAuthConnection } from '@/lib/localAuth';
import { useAuth } from './context/AuthContext';
import Features from './pages/Features';

function App() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const queryClient = new QueryClient();
  
  const storedTheme = localStorage.getItem('vite-ui-theme') || 'light';

  useEffect(() => {
    const initializeLocalStorage = () => {
      try {
        localStorage.setItem('test', 'connected');
        localStorage.removeItem('test');
        return true;
      } catch (error) {
        console.error("LocalStorage error:", error);
        return false;
      }
    };
    
    Promise.all([checkAuthConnection(), initializeLocalStorage()])
      .then(([authConnected, localStorageConnected]) => {
        setIsConnected(authConnected && localStorageConnected);
      });
  }, []);

  if (isConnected === null) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading application...</p>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="flex flex-col justify-center items-center h-screen p-4">
        <h1 className="text-2xl font-bold mb-4">Failed to Initialize Local Storage</h1>
        <p className="text-gray-600 mb-4">
          It seems there's an issue with your browser's local storage. Please ensure that:
        </p>
        <ul className="list-disc pl-5 mb-4">
          <li>Cookies and local storage are enabled in your browser.</li>
          <li>You're not in incognito/private browsing mode.</li>
          <li>Your browser is up to date.</li>
        </ul>
        <p className="text-gray-600">
          You may need to reload the page after adjusting these settings.
        </p>
      </div>
    );
  }

  return (
    <Router>
      <ThemeProvider defaultTheme={storedTheme as "dark" | "light" | "system"}>
        <AuthProvider>
          <SubscriptionProvider>
            <SettingsProvider>
              <QueryClientProvider client={queryClient}>
                <AppRoutes />
                <Toaster />
              </QueryClientProvider>
            </SettingsProvider>
          </SubscriptionProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

function AppRoutes() {
  const AuthRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, isLoading } = useAuth();
    
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-screen">
          <p>Loading authentication...</p>
        </div>
      );
    }
    
    return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
  };

  const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, isLoading } = useAuth();
    
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-screen">
          <p>Loading authentication...</p>
        </div>
      );
    }
    
    return isAuthenticated ? children : <Navigate to="/login" replace />;
  };

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/contact" element={<ContactUs />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<TermsConditions />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/features" element={<Features />} />
      
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
        path="/subscription/success"
        element={
          <PrivateRoute>
            <SubscriptionSuccess />
          </PrivateRoute>
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
            <MainLayout>
              <CreateInvoice />
            </MainLayout>
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
            <MainLayout>
              <Settings />
            </MainLayout>
          </PrivateRoute>
        }
      />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
