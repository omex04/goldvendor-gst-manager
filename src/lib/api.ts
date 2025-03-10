
import { toast } from 'sonner';

// Base API URL - will be different in development vs production
const API_URL = import.meta.env.DEV 
  ? 'http://localhost/api' // Update this to match your local PHP development server
  : '/api'; // This will work when deployed to Hostinger

// Helper function for making API requests
async function fetchWithAuth(url: string, options: RequestInit = {}) {
  try {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    // Set headers
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options.headers,
    };
    
    // Make request
    const response = await fetch(`${API_URL}${url}`, {
      ...options,
      headers,
      credentials: 'include', // Include cookies
    });
    
    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');
    
    // Parse response
    const data = isJson ? await response.json() : await response.text();
    
    // Handle non-2xx responses
    if (!response.ok) {
      const error = isJson && data.message ? data.message : data.error || 'An error occurred';
      throw new Error(error);
    }
    
    return data;
  } catch (error: any) {
    console.error('API error:', error);
    
    // Show error message
    if (error.message) {
      toast.error(error.message);
    }
    
    throw error;
  }
}

export const api = {
  // Auth endpoints
  auth: {
    login: async (email: string, password: string) => {
      const data = await fetchWithAuth('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      
      // Save token to localStorage
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      
      return data.user;
    },
    
    register: async (name: string, email: string, password: string) => {
      const data = await fetchWithAuth('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      });
      
      return data;
    },
    
    logout: async () => {
      await fetchWithAuth('/auth/logout', { method: 'POST' });
      localStorage.removeItem('token');
    },
    
    getCurrentUser: async () => {
      try {
        return await fetchWithAuth('/auth/me');
      } catch (error) {
        // Clear token if unauthorized
        localStorage.removeItem('token');
        return null;
      }
    },
  },
  
  // Invoice endpoints
  invoices: {
    getAll: () => fetchWithAuth('/invoices'),
    
    getById: (id: string) => fetchWithAuth(`/invoices/${id}`),
    
    create: (invoice: any) => fetchWithAuth('/invoices', {
      method: 'POST',
      body: JSON.stringify(invoice),
    }),
    
    markAsPaid: (id: string) => fetchWithAuth(`/invoices/${id}/mark-paid`, {
      method: 'PATCH',
    }),
    
    delete: (id: string) => fetchWithAuth(`/invoices/${id}`, {
      method: 'DELETE',
    }),
  },
  
  // Customer endpoints
  customers: {
    getAll: () => fetchWithAuth('/customers'),
    
    getById: (id: string) => fetchWithAuth(`/customers/${id}`),
    
    create: (customer: any) => fetchWithAuth('/customers', {
      method: 'POST',
      body: JSON.stringify(customer),
    }),
    
    update: (id: string, customer: any) => fetchWithAuth(`/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(customer),
    }),
    
    delete: (id: string) => fetchWithAuth(`/customers/${id}`, {
      method: 'DELETE',
    }),
  },
  
  // Settings endpoints
  settings: {
    getAll: () => fetchWithAuth('/settings'),
    
    updateVendor: (settings: any) => fetchWithAuth('/settings/vendor', {
      method: 'POST',
      body: JSON.stringify(settings),
    }),
    
    updateBank: (settings: any) => fetchWithAuth('/settings/bank', {
      method: 'POST',
      body: JSON.stringify(settings),
    }),
    
    updateGST: (settings: any) => fetchWithAuth('/settings/gst', {
      method: 'POST',
      body: JSON.stringify(settings),
    }),
    
    updatePreferences: (settings: any) => fetchWithAuth('/settings/preferences', {
      method: 'POST',
      body: JSON.stringify(settings),
    }),
  },
};
