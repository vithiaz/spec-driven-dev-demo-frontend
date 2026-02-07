/**
 * requirements: [ac-001-lms-frontend-profile-view-activity-log-journey]
 * scenarios: [view-activity-log-success, timestamp-formatting]
 */

import { format, isValid, parseISO } from 'date-fns';
import { enUS, id as idLocale } from 'date-fns/locale';

/**
 * Formats activity timestamp for display in activity log
 * Story requirement (line 81): "MMMM dd, yyyy [at] HH:mm [AM/PM]"
 * Clarifier lines 176-180: Fully localized timestamps
 *
 * English: "December 18, 2025 02:30 PM"
 * Indonesian: "18 Desember 2025 14:30"
 *
 * @param date - Date object or ISO string to format
 * @param locale - Locale string ('en' or 'id')
 * @returns Formatted timestamp string
 */
export function formatActivityTimestamp(
  date: Date | string,
  locale: 'en' | 'id' = 'en'
): string {
  // Parse date if string, otherwise use Date object
  const dateObj = typeof date === 'string' ? parseISO(date) : date;

  // Validate date using date-fns
  if (!isValid(dateObj)) {
    return '';
  }

  try {
    if (locale === 'id') {
      // Indonesian: "18 Desember 2025 14:30"
      // Format: dd MMMM yyyy HH:mm
      return format(dateObj, 'dd MMMM yyyy HH:mm', {
        locale: idLocale,
      });
    }

    // English: "December 18, 2025 02:30 PM"
    // Format: MMMM dd, yyyy hh:mm a
    return format(dateObj, 'MMMM dd, yyyy hh:mm a', {
      locale: enUS,
    });
  } catch (error) {
    // Fallback to ISO string if formatting fails
    console.error('Error formatting activity timestamp:', error);
    return dateObj.toISOString();
  }
}

/**
 * Formats timestamp for screen readers (ISO 8601 format for datetime attribute)
 * @param date - Date object or ISO string
 * @returns ISO 8601 formatted string
 */
export function formatActivityTimestampISO(date: Date | string): string {
  // Parse date if string, otherwise use Date object
  const dateObj = typeof date === 'string' ? parseISO(date) : date;

  // Validate date using date-fns
  if (!isValid(dateObj)) {
    return '';
  }

  return dateObj.toISOString();
}
