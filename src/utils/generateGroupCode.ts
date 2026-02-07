/**
 * requirements: ['lms-user-management-create-group-code-generation']
 * scenarios: ['generate-group-code-from-name']
 */

/**
 * Generates group code from name: "IT Team" → "IT-TEAM"
 */
export function generateGroupCode(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9\s\-_]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .toUpperCase();
}
