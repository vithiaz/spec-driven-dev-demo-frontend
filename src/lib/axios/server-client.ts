/**
 * Server-side HttpClient Helper
 *
 * This file provides a helper to create HttpClient instances in server-side contexts
 * (API routes, Server Actions, Route Handlers)
 *
 * IMPORTANT: Only import this file in server-side code!
 */

import HttpClient from './index';
import { createClient } from '@/lib/supabase/server';

/**
 * Create an HttpClient configured for server-side use
 * Automatically retrieves session from cookies via next/headers
 *
 * @example
 * ```typescript
 * // In API route
 * import { createServerHttpClient } from '@/lib/axios/server-client';
 *
 * export async function GET() {
 *   const httpClient = await createServerHttpClient();
 *   const data = await httpClient.get('/rest/v1/profile');
 *   return Response.json(data);
 * }
 * ```
 */
export async function createServerHttpClient(): Promise<HttpClient> {
  const supabaseClientGetter = async () => createClient();
  return new HttpClient({}, supabaseClientGetter);
}
