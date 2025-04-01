
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

interface InvoiceDetailsSettingsProps {
  paymentMethod: string;
  status: string;
  dueDate: Date;
  onPaymentMethodChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onDueDateChange: (date: Date | undefined) => void;
}

export function InvoiceDetailsSettings({
  paymentMethod,
  status,
  dueDate,
  onPaymentMethodChange,
  onStatusChange,
  onDueDateChange
}: InvoiceDetailsSettingsProps) {
  return (
    <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <Label htmlFor="payment-method" className="dark:text-gray-300">Payment Method</Label>
        <Select 
          value={paymentMethod} 
          onValueChange={onPaymentMethodChange}
        >
          <SelectTrigger id="payment-method" className="w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <SelectValue placeholder="Select payment method" />
          </SelectTrigger>
          <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
            <SelectItem value="cash">Cash</SelectItem>
            <SelectItem value="card">Card</SelectItem>
            <SelectItem value="upi">UPI</SelectItem>
            <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
            <SelectItem value="cheque">Cheque</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="invoice-status" className="dark:text-gray-300">Status</Label>
        <Select 
          value={status} 
          onValueChange={onStatusChange}
        >
          <SelectTrigger id="invoice-status" className="w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="sent">Sent</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="due-date" className="dark:text-gray-300">Due Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="due-date"
              variant={"outline"}
              className="w-full pl-3 text-left font-normal mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              {dueDate ? (
                format(dueDate, "PPP")
              ) : (
                <span>Pick a date</span>
              )}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 dark:bg-gray-800 dark:border-gray-700" align="start">
            <Calendar
              mode="single"
              selected={dueDate}
              onSelect={onDueDateChange}
              initialFocus
              className="dark:bg-gray-800"
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
