import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Routes that require authentication to use (saving/crediting features)
const PROTECTED_API_ROUTES = [
  '/api/reading/generate',
  '/api/forecast/annual',
  '/api/names/generate',
  '/api/lucky-dates',
];

// Routes that are always public
const PUBLIC_ROUTES = [
  '/api/chart/calculate',
  '/api/forecast/daily',
  '/api/compatibility',
];

// Dashboard routes (redirect to login if not authenticated)
const DASHBOARD_ROUTES = ['/dashboard', '/settings', '/profile'];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip non-matched routes
  const isProtectedApi = PROTECTED_API_ROUTES.some((r) => pathname.startsWith(r));
  const isPublicApi = PUBLIC_ROUTES.some((r) => pathname.startsWith(r));
  const isDashboard = DASHBOARD_ROUTES.some((r) => pathname.startsWith(r));

  if (!isProtectedApi && !isDashboard) {
    return NextResponse.next();
  }

  // For public API routes, always pass through
  if (isPublicApi) {
    return NextResponse.next();
  }

  // Check for Supabase auth session
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    // If Supabase is not configured, allow through in dev
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.next();
    }
    if (isProtectedApi) {
      return NextResponse.json(
        { success: false, error: 'Authentication service unavailable' },
        { status: 503 }
      );
    }
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Extract access token from cookie or Authorization header
  const authHeader = req.headers.get('authorization');
  const accessToken = authHeader?.startsWith('Bearer ')
    ? authHeader.slice(7)
    : req.cookies.get('sb-access-token')?.value;

  if (!accessToken) {
    if (isProtectedApi) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Verify the token with Supabase
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${accessToken}` } },
    });
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      if (isProtectedApi) {
        return NextResponse.json(
          { success: false, error: 'Invalid or expired session' },
          { status: 401 }
        );
      }
      return NextResponse.redirect(new URL('/login', req.url));
    }

    // Attach user ID to headers for downstream use
    const response = NextResponse.next();
    response.headers.set('x-user-id', user.id);
    response.headers.set('x-user-email', user.email ?? '');
    return response;
  } catch {
    if (isProtectedApi) {
      return NextResponse.json(
        { success: false, error: 'Authentication check failed' },
        { status: 500 }
      );
    }
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/settings/:path*',
    '/profile/:path*',
    '/api/reading/:path*',
    '/api/forecast/annual/:path*',
    '/api/names/:path*',
    '/api/lucky-dates/:path*',
  ],
};
