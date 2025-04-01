
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import type { Customer } from '@/types';

interface CustomerInfoSectionProps {
  customer: Customer;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function CustomerInfoSection({ customer, onChange }: CustomerInfoSectionProps) {
  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-lg dark:text-white">Customer Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="customer-name" className="dark:text-gray-300">Customer Name</Label>
          <Input 
            id="customer-name" 
            name="name"
            value={customer.name}
            onChange={onChange}
            className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Enter customer name"
          />
        </div>
        <div>
          <Label htmlFor="customer-address" className="dark:text-gray-300">Address</Label>
          <Input 
            id="customer-address" 
            name="address"
            value={customer.address}
            onChange={onChange}
            className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Enter customer address"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="customer-phone" className="dark:text-gray-300">Phone</Label>
            <Input 
              id="customer-phone" 
              name="phone"
              value={customer.phone}
              onChange={onChange}
              className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Phone number"
            />
          </div>
          <div>
            <Label htmlFor="customer-gst" className="dark:text-gray-300">GSTIN (optional)</Label>
            <Input 
              id="customer-gst" 
              name="gstNo"
              value={customer.gstNo}
              onChange={onChange}
              className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Customer GSTIN"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
