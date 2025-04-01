
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

interface InvoiceDetailsHeaderProps {
  invoiceNumber: string;
  date: Date;
  onInvoiceNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDateChange: (date: Date | undefined) => void;
}

export function InvoiceDetailsHeader({ 
  invoiceNumber, 
  date, 
  onInvoiceNumberChange, 
  onDateChange 
}: InvoiceDetailsHeaderProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="text-sm flex items-end gap-2">
        <div>
          <Label htmlFor="invoice-number" className="text-xs text-muted-foreground dark:text-gray-400">Invoice #</Label>
          <Input
            id="invoice-number"
            value={invoiceNumber}
            onChange={onInvoiceNumberChange}
            className="w-[120px] h-8 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="invoice-date" className="text-xs text-muted-foreground dark:text-gray-400">Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className="w-[160px] pl-3 text-left font-normal mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              {date ? (
                format(date, "PPP")
              ) : (
                <span>Pick a date</span>
              )}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 dark:bg-gray-800 dark:border-gray-700" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={onDateChange}
              initialFocus
              className="dark:bg-gray-800"
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
