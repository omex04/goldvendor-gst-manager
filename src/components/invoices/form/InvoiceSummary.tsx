
import React from 'react';

interface InvoiceSummaryProps {
  subtotal: number;
  cgstTotal: number;
  sgstTotal: number;
  grandTotal: number;
}

export function InvoiceSummary({
  subtotal,
  cgstTotal,
  sgstTotal,
  grandTotal
}: InvoiceSummaryProps) {
  return (
    <div className="flex flex-col gap-2 md:w-72 ml-auto">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground dark:text-gray-400">Subtotal:</span>
        <span className="dark:text-white">₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground dark:text-gray-400">CGST:</span>
        <span className="dark:text-white">₹{cgstTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground dark:text-gray-400">SGST:</span>
        <span className="dark:text-white">₹{sgstTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
      </div>
      <div className="flex justify-between font-medium border-t pt-2 mt-2 dark:border-gray-700">
        <span className="dark:text-white">Total:</span>
        <span className="dark:text-white">₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
      </div>
    </div>
  );
}
