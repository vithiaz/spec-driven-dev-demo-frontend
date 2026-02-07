/**
 * Generates a unique identifier (UUID v4)
 *
 * Uses crypto.randomUUID() when available (modern browsers and Node.js 19+),
 * falls back to a polyfill implementation for older environments.
 *
 * @returns A UUID v4 string
 */
export function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // Fallback implementation for environments without crypto.randomUUID
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
