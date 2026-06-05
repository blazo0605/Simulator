'use client'

import { useTransition } from 'react'
import { logout } from '@/app/actions/auth'

export function LogoutButton() {
  const [isPending, startTransition] = useTransition()

  return (
    <button
      onClick={() => startTransition(async () => { await logout() })}
      disabled={isPending}
      className="text-sm text-[--text-muted] hover:text-[--text] disabled:opacity-40 transition-colors"
    >
      {isPending ? 'Odjava…' : 'Odjavi se'}
    </button>
  )
}
