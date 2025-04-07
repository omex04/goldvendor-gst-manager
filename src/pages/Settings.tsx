
import React, { useEffect } from 'react';
import { PageTransition } from '@/components/ui/PageTransition';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useSettings } from '@/context/SettingsContext';
import { useTheme } from '@/components/ui/theme-provider';
import { toast } from 'sonner';

const Settings = () => {
  const { settings, updateVendorSettings, updateBankSettings, updateGSTSettings, updatePreferenceSettings, isLoading } = useSettings();
  const { theme } = useTheme();
  
  // Local state for form values
  const [vendorInfo, setVendorInfo] = React.useState(settings?.vendor || {
    name: '',
    address: '',
    phone: '',
    email: '',
    gstNo: '',
    panNo: '',
  });
  
  const [bankDetails, setBankDetails] = React.useState(settings?.bank || {
    accountName: '',
    accountNumber: '',
    bankName: '',
    ifscCode: '',
    branch: '',
  });
  
  const [gstSettings, setGstSettings] = React.useState(settings?.gst || {
    cgstRate: 1.5,
    sgstRate: 1.5,
    autoCalculate: true,
  });
  
  const [preferences, setPreferences] = React.useState(settings?.preferences || {
    darkMode: false,
    notifications: true,
    currency: 'INR',
    autoSave: false,
  });
  
  // Update local state when settings change
  useEffect(() => {
    if (!isLoading && settings) {
      setVendorInfo(settings.vendor);
      setBankDetails(settings.bank);
      setGstSettings(settings.gst);
      setPreferences(settings.preferences);
    }
  }, [settings, isLoading]);

  const handleVendorInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setVendorInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBankDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBankDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGstSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setGstSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : parseFloat(value)
    }));
  };
  
  const handlePreferencesChange = (key: keyof typeof preferences, value: boolean | string) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const saveVendorSettings = () => {
    updateVendorSettings(vendorInfo);
    toast.success('Business information saved successfully');
  };
  
  const saveBankSettings = () => {
    updateBankSettings(bankDetails);
    toast.success('Bank details saved successfully');
  };
  
  const saveGstSettings = () => {
    updateGSTSettings(gstSettings);
    toast.success('GST settings saved successfully');
  };
  
  const savePreferences = () => {
    updatePreferenceSettings(preferences);
    toast.success('Preferences saved successfully');
  };

  if (isLoading) {
    return (
      <PageTransition>
        <div className="flex justify-center items-center h-64">
          <p className="text-muted-foreground dark:text-gray-400">Loading settings...</p>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight dark:text-white">Settings</h1>
          <p className="text-muted-foreground dark:text-gray-400">Manage your application settings and preferences</p>
        </div>
        
        <Tabs defaultValue="business">
          <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-4 dark:bg-gray-800">
            <TabsTrigger value="business" className="dark:data-[state=active]:bg-gray-700">Business Info</TabsTrigger>
            <TabsTrigger value="bank" className="dark:data-[state=active]:bg-gray-700">Bank Details</TabsTrigger>
            <TabsTrigger value="gst" className="dark:data-[state=active]:bg-gray-700">GST Settings</TabsTrigger>
            <TabsTrigger value="preferences" className="dark:data-[state=active]:bg-gray-700">Preferences</TabsTrigger>
          </TabsList>
          
          <TabsContent value="business" className="space-y-4 mt-6">
            <Card className="dark:bg-gray-800 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="dark:text-white">Business Information</CardTitle>
                <CardDescription className="dark:text-gray-400">
                  Update your business details that will appear on invoices
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="dark:text-gray-300">Business Name</Label>
                    <Input 
                      id="name" 
                      name="name" 
                      value={vendorInfo.name || ''} 
                      onChange={handleVendorInfoChange} 
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors focus:border-gold-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gstNo" className="dark:text-gray-300">GSTIN</Label>
                    <Input 
                      id="gstNo" 
                      name="gstNo" 
                      value={vendorInfo.gstNo || ''} 
                      onChange={handleVendorInfoChange} 
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors focus:border-gold-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="panNo" className="dark:text-gray-300">PAN</Label>
                    <Input 
                      id="panNo" 
                      name="panNo" 
                      value={vendorInfo.panNo || ''} 
                      onChange={handleVendorInfoChange} 
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors focus:border-gold-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="dark:text-gray-300">Phone Number</Label>
                    <Input 
                      id="phone" 
                      name="phone" 
                      value={vendorInfo.phone || ''} 
                      onChange={handleVendorInfoChange} 
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors focus:border-gold-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="dark:text-gray-300">Email Address</Label>
                    <Input 
                      id="email" 
                      name="email" 
                      value={vendorInfo.email || ''} 
                      onChange={handleVendorInfoChange} 
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors focus:border-gold-500"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address" className="dark:text-gray-300">Address</Label>
                    <Input 
                      id="address" 
                      name="address" 
                      value={vendorInfo.address || ''} 
                      onChange={handleVendorInfoChange} 
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors focus:border-gold-500"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button 
                    onClick={saveVendorSettings} 
                    className="bg-gold-500 hover:bg-gold-600 dark:bg-gold-600 dark:hover:bg-gold-700 text-white transform hover:scale-105 transition-all"
                  >
                    Save Business Info
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="bank" className="space-y-4 mt-6">
            <Card className="dark:bg-gray-800 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="dark:text-white">Bank Account Details</CardTitle>
                <CardDescription className="dark:text-gray-400">
                  Provide your bank details for payment instructions on invoices
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="accountName" className="dark:text-gray-300">Account Name</Label>
                    <Input 
                      id="accountName" 
                      name="accountName" 
                      value={bankDetails.accountName || ''} 
                      onChange={handleBankDetailsChange} 
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors focus:border-gold-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accountNumber" className="dark:text-gray-300">Account Number</Label>
                    <Input 
                      id="accountNumber" 
                      name="accountNumber" 
                      value={bankDetails.accountNumber || ''} 
                      onChange={handleBankDetailsChange} 
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors focus:border-gold-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bankName" className="dark:text-gray-300">Bank Name</Label>
                    <Input 
                      id="bankName" 
                      name="bankName" 
                      value={bankDetails.bankName || ''} 
                      onChange={handleBankDetailsChange} 
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors focus:border-gold-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ifscCode" className="dark:text-gray-300">IFSC Code</Label>
                    <Input 
                      id="ifscCode" 
                      name="ifscCode" 
                      value={bankDetails.ifscCode || ''} 
                      onChange={handleBankDetailsChange} 
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors focus:border-gold-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="branch" className="dark:text-gray-300">Branch</Label>
                    <Input 
                      id="branch" 
                      name="branch" 
                      value={bankDetails.branch || ''} 
                      onChange={handleBankDetailsChange} 
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors focus:border-gold-500"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button 
                    onClick={saveBankSettings} 
                    className="bg-gold-500 hover:bg-gold-600 dark:bg-gold-600 dark:hover:bg-gold-700 text-white transform hover:scale-105 transition-all"
                  >
                    Save Bank Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="gst" className="space-y-4 mt-6">
            <Card className="dark:bg-gray-800 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="dark:text-white">GST Settings</CardTitle>
                <CardDescription className="dark:text-gray-400">
                  Configure default GST rates and calculation settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cgstRate" className="dark:text-gray-300">Default CGST Rate (%)</Label>
                    <Input 
                      id="cgstRate" 
                      name="cgstRate" 
                      type="number"
                      step="0.01"
                      value={gstSettings.cgstRate} 
                      onChange={handleGstSettingsChange} 
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors focus:border-gold-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sgstRate" className="dark:text-gray-300">Default SGST Rate (%)</Label>
                    <Input 
                      id="sgstRate" 
                      name="sgstRate" 
                      type="number"
                      step="0.01"
                      value={gstSettings.sgstRate} 
                      onChange={handleGstSettingsChange} 
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors focus:border-gold-500"
                    />
                  </div>
                </div>
                
                <Separator className="my-4 dark:bg-gray-700" />
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="autoCalculate" 
                    name="autoCalculate"
                    checked={gstSettings.autoCalculate} 
                    onCheckedChange={(checked) => 
                      setGstSettings(prev => ({ ...prev, autoCalculate: checked }))
                    } 
                    className="dark:bg-gray-700"
                  />
                  <Label htmlFor="autoCalculate" className="dark:text-gray-300">Auto-calculate GST on new items</Label>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    onClick={saveGstSettings} 
                    className="bg-gold-500 hover:bg-gold-600 dark:bg-gold-600 dark:hover:bg-gold-700 text-white transform hover:scale-105 transition-all"
                  >
                    Save GST Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="preferences" className="space-y-4 mt-6">
            <Card className="dark:bg-gray-800 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="dark:text-white">Application Preferences</CardTitle>
                <CardDescription className="dark:text-gray-400">
                  Customize your application experience
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="autoSave" 
                    checked={!!preferences.autoSave} 
                    onCheckedChange={(checked) => handlePreferencesChange('autoSave', checked)} 
                    className="dark:bg-gray-700"
                  />
                  <Label htmlFor="autoSave" className="dark:text-gray-300">Auto-save invoices while editing</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="darkMode" 
                    checked={!!preferences.darkMode} 
                    onCheckedChange={(checked) => handlePreferencesChange('darkMode', checked)} 
                    className="dark:bg-gray-700"
                  />
                  <Label htmlFor="darkMode" className="dark:text-gray-300">Dark mode</Label>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    onClick={savePreferences} 
                    className="bg-gold-500 hover:bg-gold-600 dark:bg-gold-600 dark:hover:bg-gold-700 text-white transform hover:scale-105 transition-all"
                  >
                    Save Preferences
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageTransition>
  );
};

export default Settings;
