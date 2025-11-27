// ========== FILE: src/utils/formatCurrency.js ==========
/**
 * Formats a number as Egyptian Pounds (EGP).
 * @param {number} amount - The number to format.
 * @returns {string} The formatted currency string.
 */
export const formatCurrency = (amount) => {
  if (typeof amount !== 'number') {
    return 'N/A';
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EGP',
    minimumFractionDigits: 2,
  }).format(amount);
};