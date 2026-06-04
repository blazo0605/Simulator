'use server'

// Server Actions run exclusively on the server — the browser never sees this code.
// That means it's safe to call Supabase here without exposing any secrets.
//
// A Server Action is just an async function marked 'use server'. When a form
// submits to it, Next.js sends a POST request to the server, runs the function,
// and can return data OR redirect — all without you writing any fetch() calls.

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

// ── Shared return type ────────────────────────────────────────────────────────
// useActionState expects the action to return the same shape each time.
// We use { error } for failures and { success } for the register confirmation flow.
export type AuthState = {
  error?: string
  success?: boolean
} | null

// ── login ─────────────────────────────────────────────────────────────────────
// Called by the login form. prevState is required by useActionState but we
// don't use it here — we always return fresh state.
export async function login(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email and password are required.' }
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: error.message }
  }

  // redirect() throws a special Next.js exception — it must be called OUTSIDE
  // any try/catch block, which is why it's here at the end, not inside one.
  redirect('/dashboard')
}

// ── register ──────────────────────────────────────────────────────────────────
// Supabase sends a confirmation email by default. After the user clicks the link
// they land on /auth/callback which exchanges the code for a real session.
// If you disabled email confirmation in Supabase → they can log in immediately.
export async function register(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email and password are required.' }
  }

  if (password.length < 6) {
    return { error: 'Password must be at least 6 characters.' }
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // After confirming their email, Supabase redirects here.
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  // If Supabase returns a session immediately, email confirmation is disabled —
  // redirect straight to the dashboard. Otherwise, show the "check your email"
  // success message.
  if (data.session) {
    redirect('/dashboard')
  }

  return { success: true }
}

// ── logout ────────────────────────────────────────────────────────────────────
// Called from the LogoutButton client component.
export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
