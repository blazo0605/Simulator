'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Mode } from '@/types/database'

export type CharacterState = { error?: string } | null

// Creates a new character and redirects to its detail page.
// redirect() is called outside any try/catch — Next.js needs to rethrow it.
export async function createCharacter(
  prevState: CharacterState,
  formData: FormData
): Promise<CharacterState> {
  const name = (formData.get('name') as string)?.trim()
  const personality = (formData.get('personality') as string)?.trim()
  const background = (formData.get('background') as string)?.trim()
  const speech_style = (formData.get('speech_style') as string)?.trim()
  const knowledge_scope = (formData.get('knowledge_scope') as string)?.trim()
  const mode = formData.get('mode') as Mode
  const learning_goals = (formData.get('learning_goals') as string)?.trim() || null

  if (!name || !personality || !background || !speech_style || !knowledge_scope || !mode) {
    return { error: 'Please fill in all required fields.' }
  }

  if (mode !== 'fun' && mode !== 'perspective') {
    return { error: 'Invalid mode selected.' }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated.' }

  const { data, error } = await supabase
    .from('characters')
    .insert({ user_id: user.id, name, personality, background, speech_style, knowledge_scope, mode, learning_goals })
    .select('id')
    .single()

  if (error) return { error: error.message }

  redirect(`/characters/${data.id}`)
}

// Creates a new conversation for a character and redirects to the chat screen.
// Called via form action with .bind(null, characterId) in Server Components.
export async function createConversation(characterId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data, error } = await supabase
    .from('conversations')
    .insert({ user_id: user.id, character_id: characterId, title: 'New conversation' })
    .select('id')
    .single()

  if (error) throw new Error(error.message)

  redirect(`/chat/${data.id}`)
}
