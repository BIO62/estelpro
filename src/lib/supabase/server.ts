import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const FETCH_TIMEOUT_MS = 8000;

let client: SupabaseClient | null = null;

export function isSupabaseConfigured() {
  return Boolean(URL && SERVICE_KEY);
}

function timedFetch(input: RequestInfo | URL, init?: RequestInit) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  return fetch(input, { ...init, signal: controller.signal }).finally(() => clearTimeout(timer));
}

/** Server-only client. Uses the service role key, so never import from client code. */
export function supabaseAdmin(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;
  if (!client) {
    client = createClient(URL, SERVICE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { fetch: timedFetch },
    });
  }
  return client;
}
