import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { createConversation } from '@/app/actions/characters'
import { PageContent } from '@/components/ui/layout'
import { FadeIn, springs } from '@/components/ui/motion'
import { ConversationList } from '@/components/characters/ConversationList'
import type { Character, Conversation } from '@/types/database'

interface Props { params: Promise<{ id: string }> }

export default async function CharacterPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data } = await supabase.from('characters').select('*').eq('id', id).single()
  const character = data as Character | null
  if (!character) notFound()

  const { data: convData } = await supabase
    .from('conversations').select('*').eq('character_id', id)
    .order('created_at', { ascending: false })

  const conversations = (convData ?? []) as Conversation[]
  const startConversation = createConversation.bind(null, character.id)

  return (
    <PageContent>
      <FadeIn>
        <div className="space-y-7">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <Link href="/dashboard" className="text-xs text-[--text-muted] hover:text-[--text] transition-colors">
                ← Nazad na tablu
              </Link>
              <div className="flex items-center gap-2.5 mt-3">
                <h1
                  className="text-xl font-semibold text-[--text]"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {character.name}
                </h1>
                <ModeBadge mode={character.mode} />
              </div>
            </div>

            <form action={startConversation}>
              <button
                type="submit"
                className="rounded-lg px-4 py-2 text-sm font-medium text-white
                           transition-all active:scale-95 shrink-0"
                style={{ background: 'var(--accent)', boxShadow: 'var(--shadow-accent)' }}
              >
                + Novi razgovor
              </button>
            </form>
          </div>

          {/* Character definition — glass card */}
          <div
            className="rounded-2xl p-5 space-y-4"
            style={{
              background: 'rgba(255,255,255,0.03)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: 'var(--shadow-2), inset 0 1px 0 rgba(255,255,255,0.05)',
            }}
          >
            <p className="text-[11px] font-semibold text-[--text-muted] uppercase tracking-widest">
              Definicija lika
            </p>
            <dl className="space-y-4">
              <DefRow label="Ličnost"       value={character.personality}    />
              <DefRow label="Pozadina"      value={character.background}     />
              <DefRow label="Stil govora"   value={character.speech_style}   />
              <DefRow label="Domen znanja"  value={character.knowledge_scope}/>
              {character.learning_goals && (
                <DefRow label="Ciljevi učenja" value={character.learning_goals} />
              )}
            </dl>
          </div>

          {/* Conversations */}
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-[--text]">Razgovori</h2>
            <ConversationList conversations={conversations} startConversation={startConversation} />
          </div>
        </div>
      </FadeIn>
    </PageContent>
  )
}

function ModeBadge({ mode }: { mode: Character['mode'] }) {
  const isFun = mode === 'fun'
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
      isFun ? 'bg-amber-500/15 text-amber-300' : 'bg-sky-500/15 text-sky-300'
    }`}>
      {isFun ? '🎭 Zabavni' : '🏛️ Edukativni'}
    </span>
  )
}

function DefRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] font-semibold text-[--text-dim] uppercase tracking-wider mb-1">{label}</dt>
      <dd className="text-sm text-[--text-muted] leading-relaxed">{value}</dd>
    </div>
  )
}
