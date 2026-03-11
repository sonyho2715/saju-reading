import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  if (!code) {
    return NextResponse.redirect(new URL('/auth/login?error=missing_code', req.url));
  }

  try {
    const supabase = createServerClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('[auth/callback] Exchange error:', error.message);
      return NextResponse.redirect(new URL('/auth/login?error=auth_failed', req.url));
    }

    if (data.user) {
      // Ensure user record exists in our users table
      const { data: existing } = await supabase
        .from('users')
        .select('id')
        .eq('id', data.user.id)
        .single();

      if (!existing) {
        await supabase.from('users').insert({
          id: data.user.id,
          email: data.user.email ?? '',
          name: data.user.user_metadata?.full_name ?? data.user.user_metadata?.name ?? null,
          preferred_language: 'en',
          subscription_tier: 'free',
        });
      }
    }

    return NextResponse.redirect(new URL(next, req.url));
  } catch (err) {
    console.error('[auth/callback] Unexpected error:', err);
    return NextResponse.redirect(new URL('/auth/login?error=unexpected', req.url));
  }
}
