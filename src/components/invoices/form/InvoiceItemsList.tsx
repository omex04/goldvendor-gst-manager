
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { InvoiceItem as InvoiceItemComponent } from '@/components/invoices/InvoiceItem';
import type { InvoiceItem } from '@/types';

interface InvoiceItemsListProps {
  items: InvoiceItem[];
  onAddItem: () => void;
  onUpdateItem: (index: number, item: InvoiceItem) => void;
  onRemoveItem: (index: number) => void;
}

export function InvoiceItemsList({ 
  items, 
  onAddItem, 
  onUpdateItem, 
  onRemoveItem 
}: InvoiceItemsListProps) {
  return (
    <>
      <div className="mb-4">
        <Button variant="outline" onClick={onAddItem} className="flex items-center gap-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
          <Plus className="h-4 w-4" />
          Add Item
        </Button>
      </div>
      
      {items.length === 0 ? (
        <div className="text-center py-8 border border-dashed rounded-lg dark:border-gray-700 dark:text-gray-400">
          <p className="text-muted-foreground">No items added yet. Click 'Add Item' to begin.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item, index) => (
            <InvoiceItemComponent
              key={item.id}
              item={item}
              index={index}
              updateItem={onUpdateItem}
              removeItem={onRemoveItem}
            />
          ))}
        </div>
      )}
    </>
  );
}
