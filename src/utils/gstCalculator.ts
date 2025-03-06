
import { useSettings } from '@/context/SettingsContext';

/**
 * Calculates GST amounts for a given price
 * @param price - The base price before GST
 * @param cgstRate - CGST rate percentage (e.g., 1.5 for 1.5%)
 * @param sgstRate - SGST rate percentage (e.g., 1.5 for 1.5%)
 * @returns Object containing calculated values
 */
export const calculateGST = (
  price: number,
  cgstRate: number,
  sgstRate: number
) => {
  const cgstAmount = (price * cgstRate) / 100;
  const sgstAmount = (price * sgstRate) / 100;
  const totalAmount = price + cgstAmount + sgstAmount;

  return {
    price,
    cgstRate,
    sgstRate,
    cgstAmount,
    sgstAmount,
    totalAmount,
  };
};

/**
 * Calculates the totals for a list of invoice items
 * @param items - Array of invoice items
 * @returns Object with subtotal, tax totals, and grand total
 */
export const calculateInvoiceTotals = (items: any[]) => {
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const cgstTotal = items.reduce((sum, item) => sum + item.cgstAmount, 0);
  const sgstTotal = items.reduce((sum, item) => sum + item.sgstAmount, 0);
  const grandTotal = subtotal + cgstTotal + sgstTotal;

  return {
    subtotal,
    cgstTotal,
    sgstTotal,
    grandTotal,
  };
};

/**
 * Hook to get current GST rates from settings
 * @returns Object with current GST rates from settings
 */
export const useGoldGSTRates = () => {
  const { settings } = useSettings();
  
  return {
    cgst: settings.gst.cgstRate,
    sgst: settings.gst.sgstRate,
  };
};

/**
 * Get standard GST rates for gold products
 * For backward compatibility
 * @returns Object with standard rates for gold products
 */
export const getGoldGSTRates = () => {
  // Default values if settings are not available
  return {
    cgst: 1.5, // 1.5% CGST for gold
    sgst: 1.5, // 1.5% SGST for gold
  };
};

/**
 * Calculate price based on weight and rate
 * @param weightInGrams - Weight in grams
 * @param ratePerGram - Rate per gram
 * @param makingCharges - Making charges (optional)
 * @returns The calculated price
 */
export const calculatePriceByWeight = (
  weightInGrams: number,
  ratePerGram: number,
  makingCharges = 0
) => {
  return weightInGrams * ratePerGram + makingCharges;
};
