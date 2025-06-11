import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";

/**
 * Format a date string to a localized format
 */
export const formatDate = (dateString: string): string => {
  try {
    return format(parseISO(dateString), "dd MMMM yyyy", { locale: id });
  } catch (error) {
    return "Tanggal tidak valid";
  }
};

/**
 * Format a number as currency (Rupiah)
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

/**
 * Truncate text to a specific length and add ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
};
