
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { ThemeProvider } from "@/components/ui/theme-provider";
import Index from "./pages/Index";
import CreateInvoice from "./pages/CreateInvoice";
import InvoiceHistory from "./pages/InvoiceHistory";
import ViewInvoice from "./pages/ViewInvoice";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useEffect, useState } from "react";

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Check if user is authenticated
    const auth = localStorage.getItem('isAuthenticated');
    setIsAuthenticated(auth === 'true');

    // Add event listener for storage events to detect login/logout in other tabs
    const handleStorageChange = () => {
      const auth = localStorage.getItem('isAuthenticated');
      setIsAuthenticated(auth === 'true');
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="gold-gst-theme">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AnimatePresence mode="wait">
              <Routes>
                {isAuthenticated ? (
                  <>
                    <Route path="/" element={<Index />} />
                    <Route path="/create-invoice" element={<CreateInvoice />} />
                    <Route path="/invoice-history" element={<InvoiceHistory />} />
                    <Route path="/view-invoice/:id" element={<ViewInvoice />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/login" element={<Navigate to="/" replace />} />
                    <Route path="/register" element={<Navigate to="/" replace />} />
                    <Route path="*" element={<NotFound />} />
                  </>
                ) : (
                  <>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="*" element={<Navigate to="/login" replace />} />
                  </>
                )}
              </Routes>
            </AnimatePresence>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
