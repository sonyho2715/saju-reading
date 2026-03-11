import { createServerClient } from './supabase';

interface SessionUser {
  id: string;
  email: string;
  tier: string;
}

/**
 * Get the current session user from Supabase auth.
 * Returns user info or null if not authenticated.
 */
export async function getUserFromSession(): Promise<SessionUser | null> {
  try {
    const supabase = createServerClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) return null;

    // Fetch user record from our users table
    const { data: profile } = await supabase
      .from('users')
      .select('id, email, subscription_tier')
      .eq('id', user.id)
      .single();

    if (!profile) {
      // User exists in auth but not in users table yet
      return {
        id: user.id,
        email: user.email ?? '',
        tier: 'free',
      };
    }

    return {
      id: profile.id,
      email: profile.email,
      tier: profile.subscription_tier,
    };
  } catch {
    return null;
  }
}

/**
 * Get session and throw/redirect if not authenticated.
 * Use in Server Components and API routes.
 */
export async function requireAuth(): Promise<SessionUser> {
  const user = await getUserFromSession();
  if (!user) {
    throw new Error('Unauthorized');
  }
  return user;
}

/**
 * Get session info without throwing.
 * Convenience alias for getUserFromSession.
 */
export async function getSession(): Promise<SessionUser | null> {
  return getUserFromSession();
}
