/**
 * useACL Hook
 *
 * React hook for accessing ACL permissions and checking user access.
 * Uses Zustand store with localStorage persistence to avoid refetching.
 * Role restrictions are defined in AppLayout menu items.
 */

'use client';

import { useEffect, useCallback, useMemo } from 'react';
import { useUser } from './useUser';
import { aclClient } from '@/lib/acl/client';
import type { Permission, PermissionCommand, Role } from '@/types/acl';
import {
  hasPermission as checkPermission,
  hasAnyPermission as checkAnyPermission,
  hasRole as checkRole,
  canAccessFeature as checkFeatureAccess,
  getAccessibleSubFeatures,
  hasAnySubFeatureAccess,
} from '@/lib/acl/utils';
import {
  useACLStore,
  useACLStoreApi,
} from '@/lib/providers/ClientStateProvider';
import {
  selectPermissions,
  selectCurrentRole,
  selectAssignedRoles,
  selectACLIsLoading,
  selectACLError,
  selectACLIsInitialized,
  selectACLHasHydrated,
} from '@/state/aclStore';

export interface UseACLReturn {
  /** Array of permission strings for the current user */
  permissions: Permission[];
  /** User's current role */
  currentRole: Role | null;
  /** User's assigned roles */
  assignedRoles: Role[];
  /** Whether ACL data is still loading */
  isLoading: boolean;
  /** Error message if ACL fetch failed */
  error: string | null;
  /** Check if user has a specific table permission (e.g., hasPermission('user_profile', 'select')) */
  hasPermission: (table: string, command: PermissionCommand) => boolean;
  /** Check if user has any of the specified permissions */
  hasAnyPermission: (
    checks: Array<{ table: string; command: PermissionCommand }>
  ) => boolean;
  /** Check if user has a specific role */
  hasRole: (role: Role | Role[]) => boolean;
  /**
   * Check if user can access a feature based on table permissions
   * Supports hierarchical: 'settings:organization:create' -> master_organizations.insert
   */
  canAccess: (feature: string) => boolean;
  /** Get accessible sub-features for a module (e.g., getSubFeatures('settings') -> ['organization', 'certificate']) */
  getSubFeatures: (module: string) => string[];
  /** Check if user has access to any sub-feature of a module */
  hasAnySubFeature: (module: string) => boolean;
  /** Refetch permissions (force refresh) */
  refetch: () => Promise<void>;
  /** Clear all ACL data (call on logout) */
  clearACL: () => void;
}

/**
 * Hook to access ACL permissions and check user access
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { hasPermission, canAccess, hasRole } = useACL();
 *
 *   // Check table permission directly
 *   if (hasPermission('user_profile', 'insert')) {
 *     // Can create users
 *   }
 *
 *   // Check feature access (uses FEATURE_TABLE_MAP)
 *   if (canAccess('settings:organization:create')) {
 *     // Can create organizations
 *   }
 *
 *   // Check role
 *   if (hasRole('super_admin')) {
 *     // Is super admin
 *   }
 * }
 * ```
 */
export function useACL(): UseACLReturn {
  const { user, isLoading: userLoading } = useUser();

  // Get state from Zustand store
  const permissions = useACLStore(selectPermissions);
  const storedCurrentRole = useACLStore(selectCurrentRole);
  const storedAssignedRoles = useACLStore(selectAssignedRoles);
  const isLoading = useACLStore(selectACLIsLoading);
  const error = useACLStore(selectACLError);
  const isInitialized = useACLStore(selectACLIsInitialized);
  const hasHydrated = useACLStore(selectACLHasHydrated);

  // Get store API for actions
  const store = useACLStoreApi();

  // Extract role information from user (fallback to stored values only when consistent)
  // Prioritize user.role from JWT when available to ensure role changes are detected
  const currentRole = useMemo<Role | null>(() => {
    if (!user) {
      // If user is not yet loaded but we have cached role data and it's fresh, use cached role
      // This prevents the dashboard from showing wrong view while user session is being restored
      return storedCurrentRole;
    }
    // Always prefer the role from the JWT token when available
    // This ensures we detect role changes immediately
    const userRole = (user.role as Role) || null;
    return userRole || storedCurrentRole;
  }, [user, storedCurrentRole]);

  const assignedRoles = useMemo<Role[]>(() => {
    if (!user) return storedAssignedRoles;
    const roles = user.app_metadata?.assigned_roles;
    if (!roles || !Array.isArray(roles)) return storedAssignedRoles;
    return roles as Role[];
  }, [user, storedAssignedRoles]);

  // Fetch permissions from API
  const fetchPermissions = useCallback(
    async (force = false) => {
      if (!user) {
        store.getState().clearACL();
        return;
      }

      // Get the role from user (JWT claims)
      const userRole = (user.role as Role) || null;
      const userAssignedRoles =
        (user.app_metadata?.assigned_roles as Role[]) || [];

      // Detect if the user or role has changed from what's stored
      const state = store.getState();
      const roleChanged = userRole && userRole !== state.currentRole;
      const shouldForce = force || roleChanged;

      // Skip if already initialized and not stale (unless forced or role changed)
      if (!shouldForce && isInitialized && !state.isStale()) {
        return;
      }

      // If role changed, update immediately even before fetch completes
      if (roleChanged) {
        store.getState().setRoles(userRole, userAssignedRoles);
      }

      try {
        store.getState().setLoading(true);
        store.getState().setError(null);

        const userPermissions = await aclClient.getUserPermissions();

        store.getState().setPermissions(userPermissions);
        store.getState().setRoles(userRole, userAssignedRoles);
        store.getState().markFetched();
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to fetch permissions';
        store.getState().setError(errorMessage);
      }
    },
    [user, isInitialized, store]
  );

  // Fetch permissions when user changes or on initial load
  useEffect(() => {
    if (!userLoading && user) {
      fetchPermissions();
    } else if (!userLoading && !user) {
      store.getState().clearACL();
    }
  }, [user, userLoading, fetchPermissions, store]);

  // Permission checking function (direct table check)
  const hasPermission = useCallback(
    (table: string, command: PermissionCommand) => {
      return checkPermission(permissions, table, command);
    },
    [permissions]
  );

  // Check any permission
  const hasAnyPermission = useCallback(
    (checks: Array<{ table: string; command: PermissionCommand }>) => {
      return checkAnyPermission(permissions, checks);
    },
    [permissions]
  );

  // Role checking function (checks current active role only)
  const hasRole = useCallback(
    (role: Role | Role[]) => {
      return checkRole(currentRole, role);
    },
    [currentRole]
  );

  // Feature access checking (uses FEATURE_TABLE_MAP)
  const canAccess = useCallback(
    (feature: string) => {
      return checkFeatureAccess(permissions, feature);
    },
    [permissions]
  );

  // Get accessible sub-features for a module
  const getSubFeatures = useCallback(
    (module: string) => {
      return getAccessibleSubFeatures(permissions, module);
    },
    [permissions]
  );

  // Check if user has access to any sub-feature
  const hasAnySubFeature = useCallback(
    (module: string) => {
      return hasAnySubFeatureAccess(permissions, module);
    },
    [permissions]
  );

  // Force refetch
  const refetch = useCallback(async () => {
    await fetchPermissions(true);
  }, [fetchPermissions]);

  // Clear ACL (for logout)
  const clearACL = useCallback(() => {
    store.getState().clearACL();
  }, [store]);

  return {
    permissions,
    currentRole,
    assignedRoles,
    // Consider loading if:
    // 1. Zustand persist hasn't hydrated from localStorage yet, OR
    // 2. User is still loading, OR
    // 3. ACL store is actively loading, OR
    // 4. User exists but ACL hasn't been initialized yet (first fetch pending)
    isLoading:
      !hasHydrated || userLoading || isLoading || (!!user && !isInitialized),
    error,
    hasPermission,
    hasAnyPermission,
    hasRole,
    canAccess,
    getSubFeatures,
    hasAnySubFeature,
    refetch,
    clearACL,
  };
}
