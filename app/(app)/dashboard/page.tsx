// Dashboard — placeholder for Phase 2 where we'll add character cards
// and the "New character" button. For now it just proves auth is working.

import Link from 'next/link'

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Your characters</h1>
        <p className="text-zinc-400 mt-1">
          Create a character to start a conversation.
        </p>
      </div>

      {/* Empty state — will be replaced with real character cards in Phase 2 */}
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-700 py-20 text-center space-y-4">
        <div className="text-5xl">🎭</div>
        <h2 className="text-lg font-semibold text-white">No characters yet</h2>
        <p className="text-sm text-zinc-400 max-w-xs">
          Characters remember who they are across every conversation. Build one to get started.
        </p>
        <Link
          href="/characters/new"
          className="rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white
                     hover:bg-violet-500 transition-colors"
        >
          + New character
        </Link>
      </div>
    </div>
  )
}
