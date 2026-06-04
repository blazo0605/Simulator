// This Route Handler handles the email-confirmation redirect from Supabase.
//
// Here is the full journey:
//   1. User clicks "register".
//   2. Supabase sends them a confirmation email with a link like:
//        https://yourapp.com/auth/callback?code=abc123
//   3. The user clicks that link.
//   4. This handler runs, exchanges the one-time code for a real session.
//   5. The user is redirected to the dashboard, now fully logged in.
//
// Without this handler, the email confirmation link would 404.

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      return NextResponse.redirect(`${origin}/dashboard`)
    }
  }

  // If there's no code or the exchange failed, send to an error page.
  // We redirect to login with an error query param so the user sees a message.
  return NextResponse.redirect(
    `${origin}/login?error=Could+not+confirm+your+email.+Try+again.`
  )
}
