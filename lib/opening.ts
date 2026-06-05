// Generates the first message in a new conversation — the character opens
// the scene in-medias-res before the user has typed anything.
//
// The trigger message is never saved to the DB; only the AI's response is
// stored as the first `assistant` message. This means the memory system
// treats it as a normal message (it flows into the 10-message window and
// eventually into compression, just like any other assistant turn).

import Groq from 'groq-sdk'
import { buildSystemPrompt, buildOpeningTrigger } from './prompt'
import type { Character } from '@/types/database'

function getGroq() {
  return new Groq({ apiKey: process.env.GROQ_API_KEY })
}

export async function generateOpening(character: Character): Promise<string> {
  const system = buildSystemPrompt(character)
  const trigger = buildOpeningTrigger(character)

  const completion = await getGroq().chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    max_tokens: 400,
    messages: [
      { role: 'system', content: system },
      { role: 'user',   content: trigger },
    ],
  })

  return completion.choices[0]?.message?.content?.trim() ?? ''
}
