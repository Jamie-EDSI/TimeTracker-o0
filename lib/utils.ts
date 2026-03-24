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
    
    // Check if it's an ISO timestamp that represents a date at midnight UTC
    // e.g., "2026-03-24T00:00:00.000Z" or "2026-03-24T00:00:00Z" or "2026-03-24T00:00:00+00:00"
    const isoDateMatch = dateString.match(/^(\d{4})-(\d{2})-(\d{2})T00:00:00/)
    if (isoDateMatch) {
      // This is a date stored as midnight UTC - parse as local date
      const [, year, month, day] = isoDateMatch
      return new Date(Number(year), Number(month) - 1, Number(day)).toLocaleDateString()
    }
    
    // For any ISO string starting with YYYY-MM-DD, extract just the date part
    // to avoid timezone conversion issues
    const datePartMatch = dateString.match(/^(\d{4})-(\d{2})-(\d{2})/)
    if (datePartMatch) {
      const [, year, month, day] = datePartMatch
      return new Date(Number(year), Number(month) - 1, Number(day)).toLocaleDateString()
    }
    
    // Fallback: parse normally (for other date formats)
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
