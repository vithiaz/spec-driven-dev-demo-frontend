/**
 * Auth server actions
 * Server-side functions for authentication
 */
'use server';

// import { createInternalApiClient, AxiosError } from '@/lib/axios';
import type { ApiResponse } from '@/types';
import type { LoginCredentials, RegisterData, AuthSession } from '@/modules/auth/types';

/**
 * Login action
 */
export async function loginAction(
  credentials: LoginCredentials
): Promise<ApiResponse<AuthSession>> {
  // TODO: Implement when API routes are ready
  console.log('Login attempt:', credentials.email);
  return {
    success: false,
    error: 'NOT_IMPLEMENTED',
    message: 'Login not implemented yet',
  };
}

/**
 * Register action
 */
export async function registerAction(data: RegisterData): Promise<ApiResponse<AuthSession>> {
  // TODO: Implement when API routes are ready
  console.log('Register attempt:', data.email);
  return {
    success: false,
    error: 'NOT_IMPLEMENTED',
    message: 'Registration not implemented yet',
  };
}

/**
 * Logout action
 */
export async function logoutAction(): Promise<ApiResponse<null>> {
  // TODO: Implement when API routes are ready
  return {
    success: false,
    error: 'NOT_IMPLEMENTED',
    message: 'Logout not implemented yet',
  };
}
