
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
 * Get standard GST rates for gold products
 * @returns Object with standard rates for gold products
 */
export const getGoldGSTRates = () => {
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
