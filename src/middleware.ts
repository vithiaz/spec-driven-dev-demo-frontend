/**
 * Next.js Middleware
 * Runs on every request to handle:
 * - Authentication state checking
 * - Protected route redirects
 * - Public route handling for authenticated users
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that don't require authentication
const publicRoutes = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
];

// Routes that are always accessible (static assets, API routes, etc.)
const ignoredRoutes = ['/_next', '/api', '/favicon.ico', '/public'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for ignored routes
  if (ignoredRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // TODO: Implement actual auth check with Supabase
  // const supabase = createMiddlewareClient({ req: request, res: NextResponse.next() });
  // const { data: { session } } = await supabase.auth.getSession();

  // Placeholder: Allow all requests for now
  const isAuthenticated = false; // TODO: Check actual session

  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

  // Redirect authenticated users away from auth pages
  if (isAuthenticated && isPublicRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Redirect unauthenticated users to login (except for public routes and home)
  if (!isAuthenticated && !isPublicRoute && pathname !== '/') {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
