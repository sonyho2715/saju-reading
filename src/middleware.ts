import { NextRequest, NextResponse } from 'next/server';
import { unsealData } from 'iron-session';
import type { SessionData } from '@/lib/auth';

// Routes that require authentication to use (saving/crediting features)
const PROTECTED_API_ROUTES = [
  '/api/forecast/annual',
  '/api/names/generate',
  '/api/lucky-dates',
];

// Dashboard routes (redirect to login if not authenticated)
const DASHBOARD_ROUTES = ['/dashboard', '/settings', '/profile'];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtectedApi = PROTECTED_API_ROUTES.some((r) => pathname.startsWith(r));
  const isDashboard = DASHBOARD_ROUTES.some((r) => pathname.startsWith(r));

  if (!isProtectedApi && !isDashboard) {
    return NextResponse.next();
  }

  // Read the sealed session cookie directly
  const cookieValue = req.cookies.get('saju_session')?.value;

  let session: SessionData | null = null;
  if (cookieValue) {
    try {
      session = await unsealData<SessionData>(cookieValue, {
        password: process.env.SESSION_SECRET ?? 'fallback-secret-at-least-32-chars-long-change-me',
      });
    } catch {
      // Invalid/expired session cookie
      session = null;
    }
  }

  if (!session?.isLoggedIn) {
    if (isProtectedApi) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  // Attach user info to headers for downstream use
  const response = NextResponse.next();
  response.headers.set('x-user-id', session.userId);
  response.headers.set('x-user-email', session.email);
  return response;
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/settings/:path*',
    '/profile/:path*',

    '/api/forecast/annual/:path*',
    '/api/names/:path*',
    '/api/lucky-dates/:path*',
  ],
};
