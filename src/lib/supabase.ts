import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

function getSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) throw new Error('NEXT_PUBLIC_SUPABASE_URL is not set');
  return url;
}

function getSupabaseAnonKey(): string {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!key) throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is not set');
  return key;
}

let _supabase: SupabaseClient<Database> | null = null;

/**
 * Browser/public client (uses anon key).
 * Lazy-initialized to avoid build-time errors when env vars are not set.
 */
export function getSupabase(): SupabaseClient<Database> {
  if (!_supabase) {
    _supabase = createClient<Database>(getSupabaseUrl(), getSupabaseAnonKey());
  }
  return _supabase;
}

/** @deprecated Use getSupabase() instead. Kept for backward compatibility. */
export const supabase = new Proxy({} as SupabaseClient<Database>, {
  get(_target, prop) {
    return Reflect.get(getSupabase(), prop);
  },
});

/**
 * Server-side client with service role key (for admin operations).
 * Only use in Server Components, Server Actions, and API routes.
 * NEVER expose this client to the browser.
 */
export function createServerClient(): SupabaseClient<Database> {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set');
  }
  return createClient<Database>(getSupabaseUrl(), serviceRoleKey);
}
