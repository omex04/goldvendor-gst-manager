
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { api } from '@/lib/api';

// Define settings types
export interface VendorSettings {
  name: string;
  address: string;
  phone: string;
  email: string;
  gstNo: string;
  panNo: string;
}

export interface BankSettings {
  accountName: string;
  accountNumber: string;
  bankName: string;
  ifscCode: string;
  branch: string;
}

export interface GSTSettings {
  cgstRate: number;
  sgstRate: number;
  autoCalculate: boolean;
}

export interface PreferenceSettings {
  autoSave: boolean;
  darkMode: boolean;
}

export interface AppSettings {
  vendor: VendorSettings;
  bank: BankSettings;
  gst: GSTSettings;
  preferences: PreferenceSettings;
}

// Default settings
const defaultSettings: AppSettings = {
  vendor: {
    name: 'Gold Jewelry Shop',
    address: '123 Jewelers Lane, Mumbai, Maharashtra',
    phone: '9876543210',
    email: 'contact@goldjewelryshop.com',
    gstNo: '27AADCG1234A1Z5',
    panNo: 'AADCG1234A',
  },
  bank: {
    accountName: 'Gold Jewelry Shop',
    accountNumber: '12345678901234',
    bankName: 'State Bank of India',
    ifscCode: 'SBIN0001234',
    branch: 'Mumbai Main Branch',
  },
  gst: {
    cgstRate: 1.5,
    sgstRate: 1.5,
    autoCalculate: true,
  },
  preferences: {
    autoSave: true,
    darkMode: false,
  },
};

// Create context
interface SettingsContextType {
  settings: AppSettings;
  updateVendorSettings: (settings: VendorSettings) => Promise<void>;
  updateBankSettings: (settings: BankSettings) => Promise<void>;
  updateGSTSettings: (settings: GSTSettings) => Promise<void>;
  updatePreferenceSettings: (settings: PreferenceSettings) => Promise<void>;
  isLoading: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  // Load settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setIsLoading(true);
        
        // Get user from localStorage to check if user is logged in
        const token = localStorage.getItem('token');
        if (!token) {
          setIsLoading(false);
          return;
        }
        
        // Get settings from API
        const settingsData = await api.settings.getAll();
        
        if (settingsData) {
          setSettings(settingsData);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
        toast.error('Failed to load settings');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSettings();
  }, []);

  // Update vendor settings
  const updateVendorSettings = async (vendorSettings: VendorSettings) => {
    try {
      await api.settings.updateVendor(vendorSettings);
      
      setSettings(prev => ({
        ...prev,
        vendor: vendorSettings
      }));
      
      toast.success('Vendor settings saved successfully');
    } catch (error) {
      console.error('Error saving vendor settings:', error);
      toast.error('Failed to save vendor settings');
    }
  };

  // Update bank settings
  const updateBankSettings = async (bankSettings: BankSettings) => {
    try {
      await api.settings.updateBank(bankSettings);
      
      setSettings(prev => ({
        ...prev,
        bank: bankSettings
      }));
      
      toast.success('Bank details saved successfully');
    } catch (error) {
      console.error('Error saving bank settings:', error);
      toast.error('Failed to save bank settings');
    }
  };

  // Update GST settings
  const updateGSTSettings = async (gstSettings: GSTSettings) => {
    try {
      await api.settings.updateGST(gstSettings);
      
      setSettings(prev => ({
        ...prev,
        gst: gstSettings
      }));
      
      toast.success('GST settings saved successfully');
    } catch (error) {
      console.error('Error saving GST settings:', error);
      toast.error('Failed to save GST settings');
    }
  };

  // Update preference settings
  const updatePreferenceSettings = async (preferenceSettings: PreferenceSettings) => {
    try {
      await api.settings.updatePreferences(preferenceSettings);
      
      setSettings(prev => ({
        ...prev,
        preferences: preferenceSettings
      }));
      
      toast.success('Preferences saved successfully');
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast.error('Failed to save preferences');
    }
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateVendorSettings,
        updateBankSettings,
        updateGSTSettings,
        updatePreferenceSettings,
        isLoading
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

// Hook to use settings context
export const useSettings = () => {
  const context = useContext(SettingsContext);
  
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  
  return context;
};
