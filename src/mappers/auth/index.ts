/**
 * Auth mapper
 * Transform API responses to view models for auth module
 */

import type { AuthUser, AuthSession } from '@/modules/auth/types';

// API response types (from backend)
interface ApiAuthUser {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

interface ApiAuthSession {
  user: ApiAuthUser;
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

/**
 * Map API user to view model
 */
export function mapApiUserToUser(apiUser: ApiAuthUser): AuthUser {
  return {
    id: apiUser.id,
    email: apiUser.email,
    firstName: apiUser.first_name,
    lastName: apiUser.last_name,
    avatarUrl: apiUser.avatar_url,
    createdAt: apiUser.created_at,
    updatedAt: apiUser.updated_at,
  };
}

/**
 * Map API session to view model
 */
export function mapApiSessionToSession(apiSession: ApiAuthSession): AuthSession {
  return {
    user: mapApiUserToUser(apiSession.user),
    accessToken: apiSession.access_token,
    refreshToken: apiSession.refresh_token,
    expiresAt: apiSession.expires_at,
  };
}
