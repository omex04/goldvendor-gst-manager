import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { CalendarIcon, Download } from 'lucide-react';
import { downloadExcel, formatInvoicesForExport, filterInvoices } from '@/utils/exportUtils';
import { Input } from '@/components/ui/input';
import type { Invoice, ExportFilters } from '@/types';
import { toast } from 'sonner';

interface InvoiceExportProps {
  invoices: Invoice[];
}

export function InvoiceExport({ invoices }: InvoiceExportProps) {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [status, setStatus] = useState('all');
  const [customer, setCustomer] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  
  const handleExport = () => {
    // Create filters object
    const filters: ExportFilters = {
      startDate: startDate || null,
      endDate: endDate || null,
      status: status as "draft" | "sent" | "paid" | "cancelled" | "all",
      customer: customer || undefined
    };
    
    // Filter invoices based on criteria
    const filteredInvoices = filterInvoices(invoices, filters);
    
    // Format invoices for export
    const exportData = formatInvoicesForExport(filteredInvoices);
    
    // Generate file name
    const dateRange = startDate && endDate
      ? `_${format(startDate, 'yyyyMMdd')}_to_${format(endDate, 'yyyyMMdd')}`
      : '';
    
    const statusText = status !== 'all' ? `_${status}` : '';
    const fileName = `invoices${dateRange}${statusText}`;
    
    // Download Excel file
    downloadExcel(exportData, fileName);
    
    // Close the dialog
    setIsOpen(false);
    
    // Show success message
    toast.success(`${filteredInvoices.length} invoices exported successfully`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Export Invoices</DialogTitle>
          <DialogDescription>
            Select the date range and status to export invoices to Excel.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Start Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : <span>Select start date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="grid gap-2">
            <label className="text-sm font-medium">End Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : <span>Select end date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="grid gap-2">
            <label className="text-sm font-medium">Status</label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <label className="text-sm font-medium">Customer Name (Optional)</label>
            <Input 
              placeholder="Filter by customer name"
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleExport} className="bg-gold-500 hover:bg-gold-600">
            <Download className="mr-2 h-4 w-4" />
            Export to Excel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default InvoiceExport;
