// Landing page — shown to visitors. If the user is already logged in,
// redirect them straight to /dashboard so they skip this page.

import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Already logged in — no need to show the landing page.
  if (user) redirect('/dashboard')

  return (
    <main className="flex flex-col flex-1 items-center justify-center px-6 py-24 text-center">
      <div className="max-w-2xl space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm text-violet-300">
          <span className="h-1.5 w-1.5 rounded-full bg-violet-400"></span>
          Immersive AI roleplay &amp; perspective simulator
        </div>

        <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl">
          Step into any{' '}
          <span className="text-violet-400">perspective</span>
        </h1>

        <p className="text-lg text-zinc-400 leading-relaxed">
          Create a character — a wizard, a historical figure, a detective — then
          have a real conversation with them. Every reply stays in character,
          every detail remembered.
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-left mt-8">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 space-y-2">
            <div className="text-2xl">🎭</div>
            <h2 className="font-semibold text-white">Fun Mode</h2>
            <p className="text-sm text-zinc-400">
              Immersive roleplay. Fantasy worlds, adventures, and creative
              storytelling.
            </p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 space-y-2">
            <div className="text-2xl">🏛️</div>
            <h2 className="font-semibold text-white">Perspective Mode</h2>
            <p className="text-sm text-zinc-400">
              Educational. Talk to historical figures, explore different
              viewpoints, learn by dialogue.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Link
            href="/register"
            className="rounded-lg bg-violet-600 px-6 py-3 font-semibold text-white hover:bg-violet-500 transition-colors"
          >
            Get started free
          </Link>
          <Link
            href="/login"
            className="rounded-lg border border-zinc-700 px-6 py-3 font-semibold text-zinc-300 hover:bg-zinc-800 transition-colors"
          >
            Sign in
          </Link>
        </div>
      </div>

      <p className="mt-20 text-xs text-zinc-600">
        Safe for educational use · Content moderation built in
      </p>
    </main>
  )
}
