
import React from 'react';
import { Button } from '@/components/ui/button';

interface ActionButtonsProps {
  onSaveDraft: () => void;
  onGenerateInvoice: () => void;
  isLoading: boolean;
}

export function ActionButtons({ onSaveDraft, onGenerateInvoice, isLoading }: ActionButtonsProps) {
  return (
    <div className="flex justify-end gap-4">
      <Button 
        variant="outline" 
        onClick={onSaveDraft}
        disabled={isLoading}
        className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600"
      >
        Save as Draft
      </Button>
      <Button 
        onClick={onGenerateInvoice} 
        className="bg-gold-500 hover:bg-gold-600 text-primary-foreground dark:bg-gold-600 dark:hover:bg-gold-700"
        disabled={isLoading}
      >
        Generate Invoice
      </Button>
    </div>
  );
}
