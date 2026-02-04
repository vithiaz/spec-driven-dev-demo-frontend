/**
 * Shared types barrel export
 * Export only truly shared types used across multiple modules
 *
 * IMPORTANT: Feature-specific types should be in their respective module folders
 * e.g., src/modules/auth/types.ts
 */

// Common API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Pagination types
export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
