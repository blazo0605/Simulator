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
      {/* Top navigation bar */}
      <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/dashboard" className="text-lg font-bold text-white tracking-tight">
            Persona<span className="text-violet-400">Sim</span>
          </Link>

          <div className="flex items-center gap-6">
            <span className="text-xs text-zinc-500 hidden sm:block">
              {user.email}
            </span>
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        {children}
      </main>
    </div>
  )
}
