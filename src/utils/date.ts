import { format } from 'date-fns';
import { enUS, id as idLocale } from 'date-fns/locale';

/**
 * Format a date to a localized string
 * @param date - Date string or Date object
 * @param locale - Locale string (default: 'en-US')
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date string
 * @deprecated Use formatDateTime for consistent date-time display
 */
export function formatDate(
  date: string | Date,
  locale: string = 'en-US',
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }
): string {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString(locale, options);
}

/**
 * Format a date with time (STANDARD FORMAT - USE THIS)
 *
 * Indonesian: "8 Des 2025 11:16" (24-hour)
 * English: "Dec 8, 2025 11:16 AM" (12-hour with AM/PM)
 *
 * IMPORTANT: Handles Supabase timestamps that may not include timezone indicator.
 * Supabase returns timestamps without 'Z' suffix by default, which causes
 * JavaScript to interpret them as local time instead of UTC.
 *
 * @param date - Date string or Date object
 * @param locale - Locale ('en' or 'id', default: 'id')
 * @returns Formatted date-time string
 */
export function formatDateTime(
  date: Date | string | null | undefined,
  locale: 'en' | 'id' = 'id'
): string {
  if (!date) return '-';

  let dateObj: Date;
  if (typeof date === 'string') {
    // Ensure UTC interpretation: if no timezone indicator, append 'Z'
    // This handles Supabase timestamps that come without 'Z' suffix
    const hasTimezoneIndicator =
      date.endsWith('Z') ||
      date.includes('+') ||
      /T\d{2}:\d{2}:\d{2}-\d{2}/.test(date);

    const utcTimestamp = hasTimezoneIndicator ? date : `${date}Z`;
    dateObj = new Date(utcTimestamp);
  } else {
    dateObj = date;
  }

  if (isNaN(dateObj.getTime())) {
    return '-';
  }

  try {
    if (locale === 'id') {
      // Indonesian: "8 Des 2025 11:16"
      return format(dateObj, 'd MMM yyyy HH:mm', { locale: idLocale });
    }

    // English: "Dec 8, 2025 11:16 AM"
    return format(dateObj, 'MMM d, yyyy hh:mm a', { locale: enUS });
  } catch {
    return '-';
  }
}

/**
 * Format a date to relative time (e.g., "2 days ago")
 * @param date - Date string or Date object
 * @returns Relative time string
 */
export function formatRelativeTime(date: string | Date): string {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000)
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  if (diffInSeconds < 31536000)
    return `${Math.floor(diffInSeconds / 2592000)} months ago`;
  return `${Math.floor(diffInSeconds / 31536000)} years ago`;
}

/**
 * Format a date to ISO string
 * @param date - Date string or Date object
 * @returns ISO date string
 */
export function toISODate(date: string | Date): string {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString();
}

/**
 * Check if a date is valid
 * @param date - Date string or Date object
 * @returns True if date is valid
 */
export function isValidDate(date: string | Date): boolean {
  if (!date) return false;
  const d = typeof date === 'string' ? new Date(date) : date;
  return !isNaN(d.getTime());
}

/**
 * Parse a date-only string (YYYY-MM-DD) as local date, not UTC
 *
 * IMPORTANT: JavaScript's new Date('YYYY-MM-DD') interprets date-only strings as UTC midnight,
 * which causes the date to shift when displayed in local timezone (e.g., UTC+7).
 * This function parses the date as local midnight instead.
 *
 * @param dateStr - Date string in YYYY-MM-DD format (from database)
 * @returns Date object at local midnight, or null if invalid
 *
 * @example
 * // In UTC+7 timezone:
 * new Date('2025-01-15') // → Jan 14, 2025 17:00:00 local (WRONG)
 * parseDateOnly('2025-01-15') // → Jan 15, 2025 00:00:00 local (CORRECT)
 */
export function parseDateOnly(dateStr: string | null | undefined): Date | null {
  if (!dateStr) return null;

  // Check if it's a date-only string (YYYY-MM-DD)
  const dateOnlyRegex = /^\d{4}-\d{2}-\d{2}$/;

  if (dateOnlyRegex.test(dateStr)) {
    // Parse as local date by splitting and using Date constructor with components
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day); // month is 0-indexed
  }

  // For other formats (with time/timezone), use standard parsing
  return new Date(dateStr);
}

/**
 * Format a Date object to YYYY-MM-DD string for API submission
 *
 * IMPORTANT: Uses local date components to avoid timezone shift.
 * Do NOT use date.toISOString().split('T')[0] as it converts to UTC first.
 *
 * @param date - Date object to format
 * @returns Date string in YYYY-MM-DD format
 *
 * @example
 * // In UTC+7 timezone, for a date selected as Jan 15, 2025:
 * date.toISOString().split('T')[0] // → '2025-01-14' (WRONG - shifted to UTC)
 * formatDateForApi(date) // → '2025-01-15' (CORRECT - uses local date)
 */
export function formatDateForApi(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Format a date in short format (MMM DD, YYYY)
 *
 * English: "Jan 13, 2026"
 * Indonesian: "13 Jan 2026"
 *
 * IMPORTANT: Handles Supabase timestamps that may not include timezone indicator.
 * Supabase returns timestamps without 'Z' suffix by default, which causes
 * JavaScript to interpret them as local time instead of UTC.
 *
 * @param date - Date string or Date object
 * @param locale - Locale ('en' or 'id', default: 'en')
 * @returns Formatted date string
 */
export function formatDateShort(
  date: Date | string | null | undefined,
  locale: 'en' | 'id' = 'en'
): string {
  if (!date) return '-';

  let dateObj: Date;
  if (typeof date === 'string') {
    // Ensure UTC interpretation: if no timezone indicator, append 'Z'
    // This handles Supabase timestamps that come without 'Z' suffix
    const hasTimezoneIndicator =
      date.endsWith('Z') ||
      date.includes('+') ||
      /T\d{2}:\d{2}:\d{2}-\d{2}/.test(date);

    const utcTimestamp = hasTimezoneIndicator ? date : `${date}Z`;
    dateObj = new Date(utcTimestamp);
  } else {
    dateObj = date;
  }

  if (isNaN(dateObj.getTime())) {
    return '-';
  }

  try {
    if (locale === 'id') {
      // Indonesian: "13 Jan 2026"
      return format(dateObj, 'd MMM yyyy', { locale: idLocale });
    }

    // English: "Jan 13, 2026"
    return format(dateObj, 'MMM d, yyyy', { locale: enUS });
  } catch {
    return '-';
  }
}

/**
 * Format a time range from start and end times
 *
 * Indonesian: "09:00 - 17:00" (24-hour format)
 * English: "09:00 AM - 05:00 PM" (12-hour with AM/PM)
 *
 * IMPORTANT: Handles Supabase timestamps that may not include timezone indicator.
 * Supabase returns timestamps without 'Z' suffix by default, which causes
 * JavaScript to interpret them as local time instead of UTC.
 *
 * @param startTime - Start time as Date object or ISO string
 * @param endTime - End time as Date object or ISO string
 * @param locale - Locale ('en' or 'id', default: 'id')
 * @returns Formatted time range string
 */
export function formatTimeRange(
  startTime: Date | string | null | undefined,
  endTime: Date | string | null | undefined,
  locale: 'en' | 'id' = 'id'
): string {
  if (!startTime || !endTime) return '-';

  // Helper function to parse timestamp with UTC handling
  const parseTimestamp = (time: Date | string): Date => {
    if (typeof time !== 'string') return time;

    // Ensure UTC interpretation: if no timezone indicator, append 'Z'
    const hasTimezoneIndicator =
      time.endsWith('Z') ||
      time.includes('+') ||
      /T\d{2}:\d{2}:\d{2}-\d{2}/.test(time);

    const utcTimestamp = hasTimezoneIndicator ? time : `${time}Z`;
    return new Date(utcTimestamp);
  };

  const startDate = parseTimestamp(startTime);
  const endDate = parseTimestamp(endTime);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return '-';
  }

  try {
    if (locale === 'id') {
      // Indonesian: "09:00 - 17:00" (24-hour)
      const start = format(startDate, 'HH:mm', { locale: idLocale });
      const end = format(endDate, 'HH:mm', { locale: idLocale });
      return `${start} - ${end}`;
    }

    // English: "09:00 AM - 05:00 PM" (12-hour with AM/PM)
    const start = format(startDate, 'hh:mm a', { locale: enUS });
    const end = format(endDate, 'hh:mm a', { locale: enUS });
    return `${start} - ${end}`;
  } catch {
    return '-';
  }
}
