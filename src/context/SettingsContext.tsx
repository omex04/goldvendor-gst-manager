
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Preferences {
  darkMode: boolean;
  notifications: boolean;
  currency: string;
}

interface Settings {
  preferences: Preferences;
}

interface SettingsContextType {
  settings: Settings | null;
  isLoading: boolean;
  updatePreferenceSettings: (preferences: Preferences) => void;
}

const defaultSettings: Settings = {
  preferences: {
    darkMode: false,
    notifications: true,
    currency: 'INR',
  },
};

const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  isLoading: true,
  updatePreferenceSettings: () => {},
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

  return (
    <SettingsContext.Provider 
      value={{ 
        settings, 
        isLoading, 
        updatePreferenceSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);

export default SettingsContext;
