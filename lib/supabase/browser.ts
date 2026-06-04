// Browser-side Supabase client — safe to import in client components.
// Uses @supabase/ssr to handle cookie-based sessions automatically.
import { createBrowserClient } from "@supabase/ssr";
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
