import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { localDB, TABLES } from '@/lib/localStorage';
import { getCurrentUser } from '@/lib/localAuth';

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

  // Load settings from localStorage
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setIsLoading(true);
        
        // Check if the user is authenticated
        const currentUser = getCurrentUser();
        if (!currentUser) {
          setIsLoading(false);
          return;
        }
        
        // Get settings from localStorage with proper type assertion
        const settingsData = localDB.selectSingle(TABLES.SETTINGS, { column: 'user_id', value: currentUser.id }) as DBSettings | null;
          
        if (settingsData) {
          setSettings(settingsData.settings);
        } else {
          // Create settings if they don't exist
          const userId = currentUser.id;
          
          const { error: insertError } = localDB.insert(TABLES.SETTINGS, {
            user_id: userId,
            settings: defaultSettings
          });
            
          if (insertError) {
            console.error('Error creating settings:', insertError);
            toast.error('Failed to create settings');
          }
        }
      } catch (error) {
        console.error('Error in settings initialization:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSettings();
  }, []);

  // Update settings in localStorage
  const saveSettings = async (updatedSettings: AppSettings) => {
    try {
      const currentUser = getCurrentUser();
      if (!currentUser) {
        throw new Error('No authenticated user');
      }
      
      const { error } = localDB.update(
        TABLES.SETTINGS,
        { settings: updatedSettings },
        { column: 'user_id', value: currentUser.id }
      );
        
      if (error) {
        throw new Error(error);
      }
      
      setSettings(updatedSettings);
      return true;
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
      return false;
    }
  };

  // Update vendor settings
  const updateVendorSettings = async (vendorSettings: VendorSettings) => {
    const updatedSettings = {
      ...settings,
      vendor: vendorSettings
    };
    
    const success = await saveSettings(updatedSettings);
    if (success) {
      toast.success('Vendor settings saved successfully');
    }
  };

  // Update bank settings
  const updateBankSettings = async (bankSettings: BankSettings) => {
    const updatedSettings = {
      ...settings,
      bank: bankSettings
    };
    
    const success = await saveSettings(updatedSettings);
    if (success) {
      toast.success('Bank details saved successfully');
    }
  };

  // Update GST settings
  const updateGSTSettings = async (gstSettings: GSTSettings) => {
    const updatedSettings = {
      ...settings,
      gst: gstSettings
    };
    
    const success = await saveSettings(updatedSettings);
    if (success) {
      toast.success('GST settings saved successfully');
    }
  };

  // Update preference settings
  const updatePreferenceSettings = async (preferenceSettings: PreferenceSettings) => {
    const updatedSettings = {
      ...settings,
      preferences: preferenceSettings
    };
    
    const success = await saveSettings(updatedSettings);
    if (success) {
      toast.success('Preferences saved successfully');
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
