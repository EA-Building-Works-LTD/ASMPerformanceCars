import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a currency value to GBP with proper formatting 
 */
export function formatCurrency(value: number | string) {
  const numValue = typeof value === 'string' ? parseFloat(value) : value
  
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numValue)
}

/**
 * Format a date string or Date object to UK format (DD/MM/YYYY)
 */
export function formatDate(date: Date | string) {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(dateObj)
}

/**
 * Truncate text to a specified length and add ellipsis
 */
export function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

/**
 * Format a number with commas
 */
export function formatNumber(number: number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

/**
 * Convert strings to URL-friendly slugs
 */
export function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
}

/**
 * Get image dimensions for optimal loading
 */
export function getImageSizes(width: number) {
  if (width < 640) return '100vw'
  if (width < 768) return '50vw'
  return '33vw'
}
