/**
 * Identity: Debounced Value Hook
 * Requirements: [ac-002-lms-frontend-course-management-lo-view-course-list]
 * Scenarios: [search-courses-by-keyword]
 */

'use client';

import { useState, useEffect } from 'react';

/**
 * Returns a debounced value that only updates after the specified delay
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds (default: 500)
 * @returns Debounced value
 */
export function useDebouncedValue<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
