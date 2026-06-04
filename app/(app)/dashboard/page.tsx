// Dashboard — lists the user's characters. Server Component: fetches data directly.

import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import type { Character } from '@/types/database'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('characters')
    .select('*')
    .order('created_at', { ascending: false })

  // Explicit cast — Supabase's generic inference collapses to `never` without it.
  const characters = data as Character[] | null

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Your characters</h1>
          <p className="text-zinc-400 mt-1">
            {characters && characters.length > 0
              ? `${characters.length} character${characters.length !== 1 ? 's' : ''}`
              : 'Create a character to start a conversation.'}
          </p>
        </div>
        <Link
          href="/characters/new"
          className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white
                     hover:bg-violet-500 transition-colors"
        >
          + New character
        </Link>
      </div>

      {!characters || characters.length === 0 ? (
        <EmptyState />
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {characters.map((character) => (
            <CharacterCard key={character.id} character={character} />
          ))}
        </ul>
      )}
    </div>
  )
}

function EmptyState() {
  return (
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
  )
}

function CharacterCard({ character }: { character: Character }) {
  const isFun = character.mode === 'fun'
  const preview = character.personality.length > 90
    ? character.personality.slice(0, 90) + '…'
    : character.personality

  return (
    <li>
      <Link
        href={`/characters/${character.id}`}
        className="flex flex-col h-full rounded-xl border border-zinc-800 bg-zinc-900/60
                   p-5 space-y-3 hover:border-zinc-600 hover:bg-zinc-800/60 transition-colors"
      >
        <div className="flex items-start justify-between gap-2">
          <span className="text-base font-semibold text-white leading-tight">
            {character.name}
          </span>
          <span
            className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              isFun
                ? 'bg-amber-500/20 text-amber-300'
                : 'bg-sky-500/20 text-sky-300'
            }`}
          >
            {isFun ? '🎭 Fun' : '🏛️ Perspective'}
          </span>
        </div>
        <p className="text-sm text-zinc-400 leading-relaxed flex-1">{preview}</p>
      </Link>
    </li>
  )
}
