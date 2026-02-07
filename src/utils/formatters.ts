/**
 * Converts underscore/snake_case status strings to Title Case
 * Examples:
 * - "in_active" -> "In Active"
 * - "active" -> "Active"
 * - "pending_approval" -> "Pending Approval"
 *
 * @param status - The status string to format
 * @returns Formatted status string in Title Case
 */
export function formatStatusName(status: string): string {
  if (!status) return '';

  return status
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Converts any snake_case or kebab-case string to Title Case
 * Examples:
 * - "super_admin" -> "Super Admin"
 * - "internal-learner" -> "Internal Learner"
 *
 * @param text - The text string to format
 * @returns Formatted text string in Title Case
 */
export function formatToTitleCase(text: string): string {
  if (!text) return '';

  return text
    .replace(/[-_]/g, ' ')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Formats an array of role strings to Title Case
 * Example:
 * - ["super_admin", "internal_learner"] -> ["Super Admin", "Internal Learner"]
 *
 * @param roles - Array of role strings
 * @returns Array of formatted role strings
 */
export function formatRoleNames(roles: string[]): string[] {
  return roles.map(formatToTitleCase);
}

/**
 * Formats a comma-separated list of values to Title Case
 * Example:
 * - "super_admin,internal_learner" -> "Super Admin, Internal Learner"
 *
 * @param list - Comma-separated string
 * @returns Formatted comma-separated string
 */
export function formatCommaSeparatedList(list: string): string {
  if (!list) return '';

  return list
    .split(',')
    .map((item) => formatToTitleCase(item.trim()))
    .join(', ');
}

/**
 * Formats file size in bytes to human-readable format
 * Examples:
 * - 0 -> "0 B"
 * - 1024 -> "1 KB"
 * - 1536 -> "1.5 KB"
 * - 1048576 -> "1 MB"
 *
 * @param bytes - File size in bytes
 * @returns Formatted file size string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}
