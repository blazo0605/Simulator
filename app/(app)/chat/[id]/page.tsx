// Chat page — Server Component.
// Loads conversation + character + message history.
// If this is a brand-new conversation (no messages yet), generates the character's
// opening message server-side before rendering, so ChatUI receives it pre-populated.

import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ChatUI } from '@/components/chat/ChatUI'
import { generateOpening } from '@/lib/opening'
import type { Character, Conversation, Message } from '@/types/database'

interface Props {
  params: Promise<{ id: string }>
}

export default async function ChatPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: convData } = await supabase
    .from('conversations')
    .select('*')
    .eq('id', id)
    .single()

  const conversation = convData as Conversation | null
  if (!conversation) notFound()

  const { data: charData } = await supabase
    .from('characters')
    .select('*')
    .eq('id', conversation.character_id)
    .single()

  const character = charData as Character | null
  if (!character) notFound()

  const { data: msgData } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', id)
    .order('created_at', { ascending: true })

  let messages = (msgData ?? []) as Message[]

  // ── Auto-opening ────────────────────────────────────────────
  // On a brand-new conversation there are no messages yet.
  // Generate the character's opening in-character and save it as the first
  // assistant message. The loading skeleton shows while this runs.
  // On any subsequent page load the messages table is non-empty, so this
  // branch is skipped — no risk of duplicate openings.
  if (messages.length === 0) {
    try {
      const openingContent = await generateOpening(character)

      if (openingContent) {
        const { data: saved } = await supabase
          .from('messages')
          .insert({
            conversation_id: id,
            role: 'assistant',
            content: openingContent,
          })
          .select('*')
          .single()

        if (saved) {
          messages = [saved as Message]
        }
      }
    } catch {
      // Opening generation is best-effort — if Groq is unavailable, the user
      // just sees an empty chat and can type first instead.
    }
  }

  return (
    <ChatUI
      conversation={conversation}
      character={character}
      initialMessages={messages}
    />
  )
}
