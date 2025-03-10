
import React from 'react';
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
import { SettingsProvider } from './context/SettingsContext';
import { ThemeProvider } from './components/ui/theme-provider';

function App() {
  const queryClient = new QueryClient();

  const AuthRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, isLoading } = useAuth();
    
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-screen">
          <p>Loading...</p>
        </div>
      );
    }
    
    return isAuthenticated ? <Navigate to="/dashboard" /> : children;
  };

  const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, isLoading } = useAuth();
    
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-screen">
          <p>Loading...</p>
        </div>
      );
    }
    
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  return (
    <ThemeProvider defaultTheme="light">
      <QueryClientProvider client={queryClient}>
        <Router>
          <AuthProvider>
            <SettingsProvider>
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
                      <MainLayout>
                        <Settings />
                      </MainLayout>
                    </PrivateRoute>
                  }
                />
                <Route path="/" element={<Navigate to="/dashboard" />} />
              </Routes>
              <Toaster />
            </SettingsProvider>
          </AuthProvider>
        </Router>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
