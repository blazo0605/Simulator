'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { register } from '@/app/actions/auth'
import { FormField } from '@/components/ui/FormField'
import { SubmitButton } from '@/components/ui/SubmitButton'

export default function RegisterPage() {
  const [state, action] = useActionState(register, null)

  // When Supabase requires email confirmation, the action returns { success: true }
  // instead of redirecting. We show a different UI in that case.
  if (state?.success) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-8 space-y-4 text-center">
        <div className="text-4xl">📬</div>
        <h1 className="text-xl font-bold text-white">Check your email</h1>
        <p className="text-sm text-zinc-400">
          We sent a confirmation link to your inbox. Click it to activate your
          account and you&apos;ll be taken straight to the app.
        </p>
        <Link
          href="/login"
          className="inline-block text-sm text-violet-400 hover:text-violet-300"
        >
          Back to sign in
        </Link>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-8 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">Create an account</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Free to use. No credit card needed.
        </p>
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
          placeholder="At least 6 characters"
          required
          autoComplete="new-password"
        />

        {state?.error && (
          <p className="text-sm text-red-400 bg-red-400/10 rounded-lg px-3 py-2">
            {state.error}
          </p>
        )}

        <SubmitButton label="Create account" pendingLabel="Creating account…" />
      </form>

      <p className="text-center text-sm text-zinc-500">
        Already have an account?{' '}
        <Link href="/login" className="text-violet-400 hover:text-violet-300">
          Sign in
        </Link>
      </p>
    </div>
  )
}
