
import React from 'react';
import { PageTransition } from '@/components/ui/PageTransition';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';

const Settings = () => {
  const handleSaveBusinessInfo = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Business information saved");
  };

  const handleSaveEmailSettings = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Email settings saved");
  };

  const handleSaveInvoiceSettings = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Invoice settings saved");
  };

  return (
    <MainLayout>
      <PageTransition>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">Manage your account settings and preferences</p>
          </div>
          
          <Tabs defaultValue="business" className="space-y-4">
            <TabsList>
              <TabsTrigger value="business">Business</TabsTrigger>
              <TabsTrigger value="invoices">Invoices</TabsTrigger>
              <TabsTrigger value="emails">Emails</TabsTrigger>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
            </TabsList>
            
            <TabsContent value="business" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Business Information</CardTitle>
                  <CardDescription>
                    This information will be displayed on your invoices
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSaveBusinessInfo} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="business-name">Business Name</Label>
                        <Input id="business-name" defaultValue="Gold Jewelry Shop" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="business-gst">GSTIN</Label>
                        <Input id="business-gst" defaultValue="27AADCG1234A1Z5" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="business-address">Address</Label>
                      <Input id="business-address" defaultValue="123 Jewelers Lane, Mumbai, Maharashtra 400001" />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="business-phone">Phone</Label>
                        <Input id="business-phone" defaultValue="+91 98765 12345" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="business-email">Email</Label>
                        <Input id="business-email" defaultValue="contact@goldjewelry.com" />
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <Button type="submit" className="bg-gold-500 hover:bg-gold-600">
                        Save Changes
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Bank Account Details</CardTitle>
                  <CardDescription>
                    Bank details for payment information on invoices
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="bank-name">Bank Name</Label>
                        <Input id="bank-name" defaultValue="HDFC Bank" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="account-holder">Account Holder Name</Label>
                        <Input id="account-holder" defaultValue="Gold Jewelry Shop" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="account-number">Account Number</Label>
                        <Input id="account-number" defaultValue="50100123456789" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ifsc-code">IFSC Code</Label>
                        <Input id="ifsc-code" defaultValue="HDFC0001234" />
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <Button className="bg-gold-500 hover:bg-gold-600">
                        Save Bank Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="invoices" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Invoice Settings</CardTitle>
                  <CardDescription>
                    Customize your invoice preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSaveInvoiceSettings} className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="invoice-prefix">Invoice Number Prefix</Label>
                          <p className="text-sm text-muted-foreground">
                            Customize the prefix of your invoice numbers
                          </p>
                        </div>
                        <Input id="invoice-prefix" defaultValue="INV-" className="w-[150px]" />
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Default Due Date</Label>
                          <p className="text-sm text-muted-foreground">
                            Set the default number of days until payment is due
                          </p>
                        </div>
                        <Input type="number" defaultValue="7" className="w-[150px]" />
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Default GST Rate</Label>
                          <p className="text-sm text-muted-foreground">
                            Set the default GST rate for new invoices
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>CGST:</span>
                          <Input type="number" defaultValue="1.5" className="w-[80px]" />
                          <span>SGST:</span>
                          <Input type="number" defaultValue="1.5" className="w-[80px]" />
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Show Signature on Invoices</Label>
                          <p className="text-sm text-muted-foreground">
                            Include authorized signatory section on invoices
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                    
                    <Button type="submit" className="bg-gold-500 hover:bg-gold-600">
                      Save Invoice Settings
                    </Button>
                  </form>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Terms & Conditions</CardTitle>
                  <CardDescription>
                    Set default terms and conditions for your invoices
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="terms">Default Terms & Conditions</Label>
                      <textarea 
                        id="terms" 
                        className="w-full min-h-[100px] p-3 rounded-md border border-input bg-transparent text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        defaultValue="Payment is due upon receipt of the invoice.
Goods once sold cannot be returned.
All disputes are subject to Mumbai jurisdiction.
E. & O.E."
                      ></textarea>
                    </div>
                    
                    <Button className="bg-gold-500 hover:bg-gold-600">
                      Save Terms
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="emails" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Email Settings</CardTitle>
                  <CardDescription>
                    Configure email notifications for invoices
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSaveEmailSettings} className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Send Invoice Via Email</Label>
                          <p className="text-sm text-muted-foreground">
                            Automatically send invoices to customers via email
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Payment Reminders</Label>
                          <p className="text-sm text-muted-foreground">
                            Send automatic reminders for overdue invoices
                          </p>
                        </div>
                        <Switch />
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Receipt Confirmation</Label>
                          <p className="text-sm text-muted-foreground">
                            Send receipt confirmation when payment is received
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email-template">Email Template</Label>
                      <textarea 
                        id="email-template" 
                        className="w-full min-h-[100px] p-3 rounded-md border border-input bg-transparent text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        defaultValue="Dear {customer_name},

Please find attached your invoice #{invoice_number} dated {invoice_date} for ₹{total_amount}.

Thank you for your business!

Best regards,
Gold Jewelry Shop"
                      ></textarea>
                    </div>
                    
                    <Button type="submit" className="bg-gold-500 hover:bg-gold-600">
                      Save Email Settings
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="appearance" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Appearance Settings</CardTitle>
                  <CardDescription>
                    Customize the look and feel of your invoices
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label>Theme Color</Label>
                      <div className="flex flex-wrap gap-2">
                        <Button className="w-10 h-10 rounded-full bg-amber-500 hover:bg-amber-600" />
                        <Button className="w-10 h-10 rounded-full bg-blue-500 hover:bg-blue-600" />
                        <Button className="w-10 h-10 rounded-full bg-green-500 hover:bg-green-600" />
                        <Button className="w-10 h-10 rounded-full bg-purple-500 hover:bg-purple-600" />
                        <Button className="w-10 h-10 rounded-full bg-red-500 hover:bg-red-600" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Logo</Label>
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center border">
                          <span className="text-2xl font-bold text-amber-600">G</span>
                        </div>
                        <Button variant="outline">Upload Logo</Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Invoice Footer</Label>
                        <p className="text-sm text-muted-foreground">
                          Show a custom footer message on all invoices
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="footer-text">Footer Text</Label>
                      <Input 
                        id="footer-text" 
                        defaultValue="Thank you for your business!"
                      />
                    </div>
                    
                    <Button className="bg-gold-500 hover:bg-gold-600">
                      Save Appearance Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </PageTransition>
    </MainLayout>
  );
};

export default Settings;
