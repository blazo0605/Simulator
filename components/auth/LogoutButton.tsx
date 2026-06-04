'use client'

// LogoutButton must be a Client Component because it uses useTransition —
// a React hook. The actual logout logic runs on the server via the Server Action.

import { useTransition } from 'react'
import { logout } from '@/app/actions/auth'

export function LogoutButton() {
  // useTransition lets us track whether the logout action is pending
  // without blocking the rest of the UI.
  const [isPending, startTransition] = useTransition()

  function handleLogout() {
    startTransition(async () => {
      await logout()
    })
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isPending}
      className="text-sm text-zinc-400 hover:text-white disabled:opacity-50 transition-colors"
    >
      {isPending ? 'Signing out…' : 'Sign out'}
    </button>
  )
}
