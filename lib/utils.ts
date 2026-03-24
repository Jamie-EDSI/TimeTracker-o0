import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a date string without timezone conversion issues.
 * 
 * Problem: When JavaScript parses a date-only string like "2026-03-24" using new Date(),
 * it interprets it as UTC midnight. When displayed in timezones behind UTC (like US timezones),
 * this causes the date to appear as the previous day.
 * 
 * Solution: For date-only strings (YYYY-MM-DD), parse the components directly to create
 * a local date. For full ISO timestamps, use the standard Date parsing.
 * 
 * @param dateString - The date string to format (ISO format or date-only)
 * @returns Formatted date string using user's locale
 */
export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "N/A"
  
  try {
    // Check if it's a date-only string (YYYY-MM-DD)
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      // Parse as local date to avoid timezone shift
      const [year, month, day] = dateString.split('-').map(Number)
      return new Date(year, month - 1, day).toLocaleDateString()
    }
    
    // For full ISO timestamps, parse normally
    return new Date(dateString).toLocaleDateString()
  } catch {
    return dateString
  }
}

/**
 * Format a datetime string for display, returning both date and time components.
 * Useful for case notes and activity timestamps.
 * 
 * @param dateString - The ISO datetime string to format
 * @returns Object with formatted date and time strings
 */
export function formatDateTime(dateString: string | null | undefined): { date: string; time: string } {
  if (!dateString) return { date: "N/A", time: "" }
  
  try {
    const date = new Date(dateString)
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }
  } catch {
    return { date: dateString, time: "" }
  }
}
