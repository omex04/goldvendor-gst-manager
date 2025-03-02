
import React, { useState } from 'react';
import { PageTransition } from '@/components/ui/PageTransition';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

const Settings = () => {
  const [vendorInfo, setVendorInfo] = useState({
    name: 'Gold Jewelry Shop',
    address: '123 Jewelers Lane, Mumbai, Maharashtra',
    phone: '9876543210',
    email: 'contact@goldjewelryshop.com',
    gstNo: '27AADCG1234A1Z5',
    panNo: 'AADCG1234A',
  });

  const [bankDetails, setBankDetails] = useState({
    accountName: 'Gold Jewelry Shop',
    accountNumber: '12345678901234',
    bankName: 'State Bank of India',
    ifscCode: 'SBIN0001234',
    branch: 'Mumbai Main Branch',
  });

  const [gstSettings, setGstSettings] = useState({
    cgstRate: 1.5,
    sgstRate: 1.5,
    autoCalculate: true,
  });

  const [autoSave, setAutoSave] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

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
    const { name, value } = e.target;
    setGstSettings(prev => ({
      ...prev,
      [name]: name === 'autoCalculate' ? (e.target as HTMLInputElement).checked : parseFloat(value)
    }));
  };

  const saveSettings = () => {
    // In a real app, you would save these settings to a database
    console.log('Saving settings:', {
      vendorInfo,
      bankDetails,
      gstSettings,
      preferences: {
        autoSave,
        darkMode
      }
    });
    
    toast.success('Settings saved successfully');
  };

  return (
    <MainLayout>
      <PageTransition>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">Manage your application settings and preferences</p>
          </div>
          
          <Tabs defaultValue="business">
            <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="business">Business Info</TabsTrigger>
              <TabsTrigger value="bank">Bank Details</TabsTrigger>
              <TabsTrigger value="gst">GST Settings</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
            </TabsList>
            
            <TabsContent value="business" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Business Information</CardTitle>
                  <CardDescription>
                    Update your business details that will appear on invoices
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Business Name</Label>
                      <Input 
                        id="name" 
                        name="name" 
                        value={vendorInfo.name} 
                        onChange={handleVendorInfoChange} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gstNo">GSTIN</Label>
                      <Input 
                        id="gstNo" 
                        name="gstNo" 
                        value={vendorInfo.gstNo} 
                        onChange={handleVendorInfoChange} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="panNo">PAN</Label>
                      <Input 
                        id="panNo" 
                        name="panNo" 
                        value={vendorInfo.panNo} 
                        onChange={handleVendorInfoChange} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input 
                        id="phone" 
                        name="phone" 
                        value={vendorInfo.phone} 
                        onChange={handleVendorInfoChange} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email" 
                        name="email" 
                        value={vendorInfo.email} 
                        onChange={handleVendorInfoChange} 
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address">Address</Label>
                      <Input 
                        id="address" 
                        name="address" 
                        value={vendorInfo.address} 
                        onChange={handleVendorInfoChange} 
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="bank" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Bank Account Details</CardTitle>
                  <CardDescription>
                    Provide your bank details for payment instructions on invoices
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="accountName">Account Name</Label>
                      <Input 
                        id="accountName" 
                        name="accountName" 
                        value={bankDetails.accountName} 
                        onChange={handleBankDetailsChange} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="accountNumber">Account Number</Label>
                      <Input 
                        id="accountNumber" 
                        name="accountNumber" 
                        value={bankDetails.accountNumber} 
                        onChange={handleBankDetailsChange} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bankName">Bank Name</Label>
                      <Input 
                        id="bankName" 
                        name="bankName" 
                        value={bankDetails.bankName} 
                        onChange={handleBankDetailsChange} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ifscCode">IFSC Code</Label>
                      <Input 
                        id="ifscCode" 
                        name="ifscCode" 
                        value={bankDetails.ifscCode} 
                        onChange={handleBankDetailsChange} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="branch">Branch</Label>
                      <Input 
                        id="branch" 
                        name="branch" 
                        value={bankDetails.branch} 
                        onChange={handleBankDetailsChange} 
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="gst" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>GST Settings</CardTitle>
                  <CardDescription>
                    Configure default GST rates and calculation settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cgstRate">Default CGST Rate (%)</Label>
                      <Input 
                        id="cgstRate" 
                        name="cgstRate" 
                        type="number"
                        step="0.01"
                        value={gstSettings.cgstRate} 
                        onChange={handleGstSettingsChange} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sgstRate">Default SGST Rate (%)</Label>
                      <Input 
                        id="sgstRate" 
                        name="sgstRate" 
                        type="number"
                        step="0.01"
                        value={gstSettings.sgstRate} 
                        onChange={handleGstSettingsChange} 
                      />
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="autoCalculate" 
                      name="autoCalculate"
                      checked={gstSettings.autoCalculate} 
                      onCheckedChange={(checked) => 
                        setGstSettings(prev => ({ ...prev, autoCalculate: checked }))
                      } 
                    />
                    <Label htmlFor="autoCalculate">Auto-calculate GST on new items</Label>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="preferences" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Application Preferences</CardTitle>
                  <CardDescription>
                    Customize your application experience
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="autoSave" 
                      checked={autoSave} 
                      onCheckedChange={setAutoSave} 
                    />
                    <Label htmlFor="autoSave">Auto-save invoices while editing</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="darkMode" 
                      checked={darkMode} 
                      onCheckedChange={setDarkMode} 
                    />
                    <Label htmlFor="darkMode">Dark mode</Label>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end">
            <Button onClick={saveSettings} className="bg-gold-500 hover:bg-gold-600">
              Save Settings
            </Button>
          </div>
        </div>
      </PageTransition>
    </MainLayout>
  );
};

export default Settings;
