
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import type { VendorInfo } from '@/types';

interface VendorInfoSectionProps {
  vendorInfo: VendorInfo;
}

export function VendorInfoSection({ vendorInfo }: VendorInfoSectionProps) {
  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-lg dark:text-white">Vendor Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="vendor-name" className="dark:text-gray-300">Business Name</Label>
          <Input 
            id="vendor-name" 
            value={vendorInfo.name} 
            className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            readOnly
          />
        </div>
        <div>
          <Label htmlFor="vendor-gst" className="dark:text-gray-300">GSTIN</Label>
          <Input 
            id="vendor-gst" 
            value={vendorInfo.gstNo} 
            className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            readOnly
          />
        </div>
        <div>
          <Label htmlFor="vendor-address" className="dark:text-gray-300">Address</Label>
          <Input 
            id="vendor-address" 
            value={vendorInfo.address} 
            className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            readOnly
          />
        </div>
      </CardContent>
    </Card>
  );
}
