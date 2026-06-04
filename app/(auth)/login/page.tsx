'use client'

// 'use client' is required here because we use useActionState — a React hook.
// Hooks only work in Client Components.
//
// The FORM itself can still call a Server Action (action={action}).
// "Client Component" doesn't mean "runs only in the browser" — it means
// "uses browser/React hooks". It still renders on the server for the first load.

import { useActionState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { login } from '@/app/actions/auth'
import { FormField } from '@/components/ui/FormField'
import { SubmitButton } from '@/components/ui/SubmitButton'
import { Suspense } from 'react'

// Separated into its own component because useSearchParams() requires Suspense.
function LoginForm() {
  // useActionState wires up a Server Action to a form and gives us back:
  //   state  — whatever the action last returned (our { error } object)
  //   action — a wrapped version of login to pass to the form's action prop
  const [state, action] = useActionState(login, null)

  // useSearchParams reads query params like ?error=... from the URL.
  // We use this to show the error message from the /auth/callback redirect.
  const searchParams = useSearchParams()
  const urlError = searchParams.get('error')

  const errorMessage = state?.error ?? urlError

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-8 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">Welcome back</h1>
        <p className="text-sm text-zinc-400 mt-1">Sign in to your account</p>
      </div>

      <form action={action} className="space-y-4">
        <FormField
          label="Email"
          name="email"
          type="email"
          placeholder="you@example.com"
          required
          autoComplete="email"
        />
        <FormField
          label="Password"
          name="password"
          type="password"
          placeholder="••••••••"
          required
          autoComplete="current-password"
        />

        {errorMessage && (
          <p className="text-sm text-red-400 bg-red-400/10 rounded-lg px-3 py-2">
            {errorMessage}
          </p>
        )}

        <SubmitButton label="Sign in" pendingLabel="Signing in…" />
      </form>

      <p className="text-center text-sm text-zinc-500">
        No account?{' '}
        <Link href="/register" className="text-violet-400 hover:text-violet-300">
          Create one
        </Link>
      </p>
    </div>
  )
}

export default function LoginPage() {
  // Suspense is required around any component that uses useSearchParams().
  return (
    <Suspense fallback={<div className="h-64 rounded-xl border border-zinc-800 bg-zinc-900/80 animate-pulse" />}>
      <LoginForm />
    </Suspense>
  )
}
