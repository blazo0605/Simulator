// This layout wraps every authenticated page (dashboard, character creator, chat).
// It runs on the server and reads the Supabase session from the cookie.
// If there's no valid session, it immediately redirects to /login.
//
// This is the "gatekeeper" — no authenticated page needs its own auth check.

import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { LogoutButton } from '@/components/auth/LogoutButton'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  // getUser() verifies the session with Supabase's server (not just the cookie).
  // This is more secure than getSession() which only reads the local cookie.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="flex flex-col flex-1">
      <header
        className="sticky top-0 z-10 h-14"
        style={{
          background: 'rgba(0,0,0,0.50)',
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          boxShadow: 'inset 0 -1px 0 rgba(255,255,255,0.04)',
        }}
      >
        <div className="max-w-[64rem] mx-auto px-4 h-full flex items-center justify-between">
          <Link
            href="/dashboard"
            className="text-base font-bold tracking-tight"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            <span className="text-[--text]">Persona</span>
            <span className="text-violet-400">Sim</span>
          </Link>
          <div className="flex items-center gap-5">
            <span className="text-xs text-[--text-muted] hidden sm:block">{user.email}</span>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col max-w-[64rem] mx-auto w-full px-4">
        {children}
      </main>
    </div>
  )
}
