
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { TrashIcon } from 'lucide-react';
import { calculateGST, calculatePriceByWeight } from '@/utils/gstCalculator';

interface InvoiceItemProps {
  item: any;
  index: number;
  updateItem: (index: number, item: any) => void;
  removeItem: (index: number) => void;
}

export function InvoiceItem({ item, index, updateItem, removeItem }: InvoiceItemProps) {
  const [localItem, setLocalItem] = useState(item);
  
  // Re-calculate whenever necessary inputs change
  useEffect(() => {
    if (
      localItem.weightInGrams &&
      localItem.ratePerGram
    ) {
      const price = calculatePriceByWeight(
        parseFloat(localItem.weightInGrams),
        parseFloat(localItem.ratePerGram),
        parseFloat(localItem.makingCharges || 0)
      );
      
      const { cgstAmount, sgstAmount, totalAmount } = calculateGST(
        price,
        parseFloat(localItem.cgstRate || 1.5),
        parseFloat(localItem.sgstRate || 1.5)
      );
      
      setLocalItem({
        ...localItem,
        price,
        cgstAmount,
        sgstAmount,
        totalAmount,
      });
    }
  }, [
    localItem.weightInGrams,
    localItem.ratePerGram,
    localItem.makingCharges,
    localItem.cgstRate,
    localItem.sgstRate,
  ]);
  
  // Update parent whenever local item changes
  useEffect(() => {
    updateItem(index, localItem);
  }, [localItem, index, updateItem]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalItem({
      ...localItem,
      [name]: value,
    });
  };

  return (
    <div className="grid grid-cols-12 gap-2 p-4 mb-4 border border-border rounded-lg bg-white/50">
      <div className="col-span-12 md:col-span-3">
        <label className="text-xs text-muted-foreground mb-1 block">Item Name</label>
        <Input
          name="name"
          value={localItem.name}
          onChange={handleInputChange}
          placeholder="Gold Ring"
          className="text-sm"
        />
      </div>
      
      <div className="col-span-6 md:col-span-2">
        <label className="text-xs text-muted-foreground mb-1 block">HSN Code</label>
        <Input
          name="hsnCode"
          value={localItem.hsnCode}
          onChange={handleInputChange}
          placeholder="7113"
          className="text-sm"
        />
      </div>
      
      <div className="col-span-6 md:col-span-1">
        <label className="text-xs text-muted-foreground mb-1 block">Weight (g)</label>
        <Input
          name="weightInGrams"
          type="number"
          value={localItem.weightInGrams}
          onChange={handleInputChange}
          placeholder="10.5"
          className="text-sm"
        />
      </div>
      
      <div className="col-span-6 md:col-span-1">
        <label className="text-xs text-muted-foreground mb-1 block">Rate/g (₹)</label>
        <Input
          name="ratePerGram"
          type="number"
          value={localItem.ratePerGram}
          onChange={handleInputChange}
          placeholder="5500"
          className="text-sm"
        />
      </div>
      
      <div className="col-span-6 md:col-span-1">
        <label className="text-xs text-muted-foreground mb-1 block">Making (₹)</label>
        <Input
          name="makingCharges"
          type="number"
          value={localItem.makingCharges}
          onChange={handleInputChange}
          placeholder="2000"
          className="text-sm"
        />
      </div>
      
      <div className="col-span-6 md:col-span-1">
        <label className="text-xs text-muted-foreground mb-1 block">Price (₹)</label>
        <Input
          name="price"
          type="number"
          value={localItem.price}
          readOnly
          className="text-sm bg-muted/50"
        />
      </div>
      
      <div className="col-span-4 md:col-span-1">
        <label className="text-xs text-muted-foreground mb-1 block">CGST (%)</label>
        <Input
          name="cgstRate"
          type="number"
          value={localItem.cgstRate}
          onChange={handleInputChange}
          className="text-sm"
        />
      </div>
      
      <div className="col-span-4 md:col-span-1">
        <label className="text-xs text-muted-foreground mb-1 block">SGST (%)</label>
        <Input
          name="sgstRate"
          type="number"
          value={localItem.sgstRate}
          onChange={handleInputChange}
          className="text-sm"
        />
      </div>
      
      <div className="col-span-4 md:col-span-1">
        <label className="text-xs text-muted-foreground mb-1 block">Total (₹)</label>
        <div className="flex items-center gap-2">
          <Input
            name="totalAmount"
            type="number"
            value={localItem.totalAmount}
            readOnly
            className="text-sm bg-muted/50"
          />
          <Button 
            variant="destructive" 
            size="icon" 
            className="h-9 w-9" 
            onClick={() => removeItem(index)}
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default InvoiceItem;
