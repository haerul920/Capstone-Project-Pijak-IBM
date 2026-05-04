import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatIDR(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatAbbreviatedIDR(amount: number): string {
  if (amount >= 1e9) {
    return `Rp ${(amount / 1e9).toFixed(1).replace('.', ',')} M`;
  }
  if (amount >= 1e6) {
    return `Rp ${(amount / 1e6).toFixed(1).replace('.', ',')} Jt`;
  }
  return formatIDR(amount);
}
