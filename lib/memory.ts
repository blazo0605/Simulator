// Memory layer — summarises old messages so the AI remembers long conversations
// without the context window filling up with raw message history.
//
// How it works:
// 1. After each AI reply, we check the total message count.
// 2. If it exceeds COMPRESSION_THRESHOLD, we take everything EXCEPT the last
//    KEEP_RECENT messages and ask a fast model to compress them into a summary
//    and a list of key facts.
// 3. That compressed memory is stored in `conversation_memory` (upsert).
// 4. On the NEXT request, `loadMemory` retrieves it and we inject it into the
//    system prompt BEFORE the recent message history. The model sees:
//    "Here's what happened earlier → here's the last few turns."

import Groq from 'groq-sdk'

// Use a cheap, fast model for summarisation — we don't need the big one here.
function getGroq() {
  return new Groq({ apiKey: process.env.GROQ_API_KEY })
}

const COMPRESSION_THRESHOLD = 20 // compress once we exceed this many messages
const KEEP_RECENT = 10           // always keep this many recent messages verbatim

export interface Memory {
  summary: string
  facts: string[]
}

// Retrieves the stored summary/facts for a conversation, or null if none yet.
export async function loadMemory(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  conversationId: string
): Promise<Memory | null> {
  const { data } = await supabase
    .from('conversation_memory')
    .select('summary, facts')
    .eq('conversation_id', conversationId)
    .single()

  return data ?? null
}

// Formats memory into a block that gets appended to the system prompt.
export function formatMemoryBlock(memory: Memory): string {
  const factLines =
    memory.facts.length > 0
      ? memory.facts.map(f => `- ${f}`).join('\n')
      : '(none recorded)'

  return (
    '\n\nMEMORY FROM EARLIER IN THIS CONVERSATION:\n' +
    `Summary: ${memory.summary}\n` +
    `Key facts:\n${factLines}`
  )
}

// Called after every AI reply. If the conversation is long enough, compresses
// old messages into the conversation_memory table. Safe to fire after the
// stream closes — never throws (memory is best-effort).
export async function maybeCompressMemory(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  conversationId: string,
  characterName: string
): Promise<void> {
  try {
    // Count all messages in this conversation
    const { count } = await supabase
      .from('messages')
      .select('id', { count: 'exact', head: true })
      .eq('conversation_id', conversationId)

    if (!count || count <= COMPRESSION_THRESHOLD) return

    // Fetch only the messages that will be compressed (skip the latest ones)
    const { data: toCompress } = await supabase
      .from('messages')
      .select('role, content')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .range(0, count - KEEP_RECENT - 1)

    if (!toCompress || toCompress.length < 6) return // too few to bother

    const transcript = (toCompress as { role: string; content: string }[])
      .map(m => `${m.role === 'user' ? 'User' : characterName}: ${m.content}`)
      .join('\n\n')

    const completion = await getGroq().chat.completions.create({
      model: 'llama-3.1-8b-instant',
      max_tokens: 512,
      messages: [
        {
          role: 'system',
          content: 'You summarise conversations. Respond ONLY with valid JSON, no markdown.',
        },
        {
          role: 'user',
          content:
            `Summarise this conversation between a user and ${characterName}.\n` +
            `Return JSON with:\n` +
            `- "summary": 2–3 sentences describing what was discussed\n` +
            `- "facts": array of specific details, names, or decisions mentioned\n\n` +
            `Conversation:\n${transcript}`,
        },
      ],
      response_format: { type: 'json_object' },
    })

    const raw = completion.choices[0]?.message?.content ?? '{}'
    const parsed = JSON.parse(raw) as { summary?: string; facts?: string[] }

    if (!parsed.summary) return

    await supabase.from('conversation_memory').upsert({
      conversation_id: conversationId,
      summary: parsed.summary,
      facts: parsed.facts ?? [],
      updated_at: new Date().toISOString(),
    })
  } catch {
    // Memory compression is best-effort — a failure here must never break chat
  }
}
