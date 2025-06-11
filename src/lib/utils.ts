import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge Tailwind CSS classes and handle conflicts
 * This allows for conditionally applying classes and proper overriding
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
