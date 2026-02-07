/**
 * Generate a UUID v4
 *
 * Uses crypto.randomUUID() when available (modern browsers and Node.js 19+),
 * falls back to a manual implementation for older environments.
 */
export function generateUUID(): string {
  // Use native crypto.randomUUID if available
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID();
  }

  // Fallback implementation for environments without crypto.randomUUID
  // This generates a RFC4122 version 4 compliant UUID
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r =
      typeof crypto !== 'undefined' && crypto.getRandomValues
        ? crypto.getRandomValues(new Uint8Array(1))[0] & 15
        : (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
