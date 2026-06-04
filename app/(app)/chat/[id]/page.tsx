// Chat page — Server Component wrapper.
// Loads the conversation, its character, and the message history from Supabase.
// Then hands everything off to ChatUI (a Client Component) which handles
// the interactive streaming.

import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ChatUI } from '@/components/chat/ChatUI'
import type { Character, Conversation, Message } from '@/types/database'

interface Props {
  params: Promise<{ id: string }>
}

export default async function ChatPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  // Load conversation — RLS ensures the user can only see their own
  const { data: convData } = await supabase
    .from('conversations')
    .select('*')
    .eq('id', id)
    .single()

  const conversation = convData as Conversation | null
  if (!conversation) notFound()

  // Load character
  const { data: charData } = await supabase
    .from('characters')
    .select('*')
    .eq('id', conversation.character_id)
    .single()

  const character = charData as Character | null
  if (!character) notFound()

  // Load full message history, oldest first
  const { data: msgData } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', id)
    .order('created_at', { ascending: true })

  const messages = (msgData ?? []) as Message[]

  return (
    <ChatUI
      conversation={conversation}
      character={character}
      initialMessages={messages}
    />
  )
}
