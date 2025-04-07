
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface VendorInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  gstNo: string;
  panNo?: string;
}

interface BankDetails {
  accountName: string;
  accountNumber: string;
  bankName: string;
  ifscCode: string;
  branch: string;
}

interface GSTSettings {
  cgstRate: number;
  sgstRate: number;
  autoCalculate: boolean;
}

interface Preferences {
  darkMode: boolean;
  notifications: boolean;
  currency: string;
  autoSave: boolean;
}

interface Settings {
  preferences: Preferences;
  vendor: VendorInfo;
  bank: BankDetails;
  gst: GSTSettings;
}

interface SettingsContextType {
  settings: Settings | null;
  isLoading: boolean;
  updatePreferenceSettings: (preferences: Preferences) => void;
  updateVendorSettings: (vendor: VendorInfo) => void;
  updateBankSettings: (bank: BankDetails) => void;
  updateGSTSettings: (gst: GSTSettings) => void;
}

const defaultSettings: Settings = {
  preferences: {
    darkMode: false,
    notifications: true,
    currency: 'INR',
    autoSave: false,
  },
  vendor: {
    name: 'Gold GST Manager',
    address: '123 Gold Street, Jewellery Market, Mumbai, 400001',
    phone: '+91 9876543210',
    email: 'contact@goldgst.com',
    gstNo: '27AABCG1234A1Z5',
    panNo: 'AABCG1234A',
  },
  bank: {
    accountName: 'Gold GST Manager Pvt Ltd',
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
};

const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  isLoading: true,
  updatePreferenceSettings: () => {},
  updateVendorSettings: () => {},
  updateBankSettings: () => {},
  updateGSTSettings: () => {},
});

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        // Load settings from localStorage
        const storedSettings = localStorage.getItem('user_settings');
        if (storedSettings) {
          setSettings(JSON.parse(storedSettings));
        } else {
          // If no settings exist, use defaults
          setSettings(defaultSettings);
          localStorage.setItem('user_settings', JSON.stringify(defaultSettings));
        }
      } catch (error) {
        console.error('Error loading settings:', error);
        // Use defaults if there's an error
        setSettings(defaultSettings);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const updatePreferenceSettings = (preferences: Preferences) => {
    if (!settings) return;

    const updatedSettings = {
      ...settings,
      preferences,
    };

    setSettings(updatedSettings);
    localStorage.setItem('user_settings', JSON.stringify(updatedSettings));
  };

  const updateVendorSettings = (vendor: VendorInfo) => {
    if (!settings) return;

    const updatedSettings = {
      ...settings,
      vendor,
    };

    setSettings(updatedSettings);
    localStorage.setItem('user_settings', JSON.stringify(updatedSettings));
  };

  const updateBankSettings = (bank: BankDetails) => {
    if (!settings) return;

    const updatedSettings = {
      ...settings,
      bank,
    };

    setSettings(updatedSettings);
    localStorage.setItem('user_settings', JSON.stringify(updatedSettings));
  };

  const updateGSTSettings = (gst: GSTSettings) => {
    if (!settings) return;

    const updatedSettings = {
      ...settings,
      gst,
    };

    setSettings(updatedSettings);
    localStorage.setItem('user_settings', JSON.stringify(updatedSettings));
  };

  return (
    <SettingsContext.Provider 
      value={{ 
        settings, 
        isLoading, 
        updatePreferenceSettings,
        updateVendorSettings,
        updateBankSettings,
        updateGSTSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);

export default SettingsContext;
