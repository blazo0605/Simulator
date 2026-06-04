// Character detail page — shows the character's definition and all past conversations.
// Server Component: data is fetched here, no client state needed.

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { createConversation } from '@/app/actions/characters'
import type { Character, Conversation } from '@/types/database'

interface Props {
  params: Promise<{ id: string }>
}

export default async function CharacterPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  // Fetch character — RLS guarantees we only get rows owned by this user.
  // Explicit cast because Supabase's generic inference can collapse to `never`
  // when the SDK version doesn't thread the Database type through correctly.
  const { data } = await supabase
    .from('characters')
    .select('*')
    .eq('id', id)
    .single()

  const character = data as Character | null
  if (!character) notFound()

  // Fetch all conversations for this character, newest first.
  const { data: convData } = await supabase
    .from('conversations')
    .select('*')
    .eq('character_id', id)
    .order('created_at', { ascending: false })

  const conversations = convData as Conversation[] | null

  // Pre-bind the character id so the form action carries it without a hidden input.
  const startConversation = createConversation.bind(null, character.id)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link href="/dashboard" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
            ← Back to dashboard
          </Link>
          <div className="flex items-center gap-3 mt-3">
            <h1 className="text-2xl font-bold text-white">{character.name}</h1>
            <ModeBadge mode={character.mode} />
          </div>
        </div>

        {/* New conversation button — submits the bound Server Action */}
        <form action={startConversation}>
          <button
            type="submit"
            className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white
                       hover:bg-violet-500 transition-colors shrink-0"
          >
            + New conversation
          </button>
        </form>
      </div>

      {/* Character definition card */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-4">
        <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide">
          Character definition
        </h2>
        <DefinitionRow label="Personality" value={character.personality} />
        <DefinitionRow label="Background" value={character.background} />
        <DefinitionRow label="Speech style" value={character.speech_style} />
        <DefinitionRow label="Knowledge scope" value={character.knowledge_scope} />
        {character.learning_goals && (
          <DefinitionRow label="Learning goals" value={character.learning_goals} />
        )}
      </div>

      {/* Conversation list */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Conversations</h2>

        {!conversations || conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-700 py-14 text-center space-y-3">
            <p className="text-sm text-zinc-400">No conversations yet.</p>
            <form action={startConversation}>
              <button
                type="submit"
                className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white
                           hover:bg-violet-500 transition-colors"
              >
                Start the first conversation
              </button>
            </form>
          </div>
        ) : (
          <ul className="space-y-2">
            {conversations.map((conv) => (
              <ConversationRow key={conv.id} conversation={conv} />
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

function ModeBadge({ mode }: { mode: Character['mode'] }) {
  const isFun = mode === 'fun'
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
        isFun
          ? 'bg-amber-500/20 text-amber-300'
          : 'bg-sky-500/20 text-sky-300'
      }`}
    >
      {isFun ? '🎭 Fun' : '🏛️ Perspective'}
    </span>
  )
}

function DefinitionRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1">{label}</dt>
      <dd className="text-sm text-zinc-300 leading-relaxed">{value}</dd>
    </div>
  )
}

function ConversationRow({ conversation }: { conversation: Conversation }) {
  const date = new Date(conversation.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <li>
      <Link
        href={`/chat/${conversation.id}`}
        className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/60
                   px-5 py-4 hover:border-zinc-600 hover:bg-zinc-800/60 transition-colors"
      >
        <span className="text-sm font-medium text-white">{conversation.title}</span>
        <span className="text-xs text-zinc-500 shrink-0 ml-4">{date}</span>
      </Link>
    </li>
  )
}
