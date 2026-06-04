// Streaming chat endpoint — POST /api/chat
//
// Flow:
// 1. Authenticate the user via Supabase session cookie
// 2. Load conversation + character from Supabase (RLS blocks other users' rows)
// 3. Run moderation check on the user message (mode-aware)
// 4. Load any stored memory (summary + facts from earlier in the conversation)
// 5. Load recent message history (last 10 messages)
// 6. Save the incoming user message
// 7. Build system prompt — inject memory block if one exists
// 8. Stream a response from Groq (llama-3.3-70b-versatile)
// 9. Save the completed AI message, then trigger memory compression if needed
//
// GROQ_API_KEY is never sent to the client — this file only runs on the server.

import { NextRequest } from 'next/server'
import Groq from 'groq-sdk'
import { createClient } from '@/lib/supabase/server'
import { buildSystemPrompt } from '@/lib/prompt'
import { loadMemory, formatMemoryBlock, maybeCompressMemory } from '@/lib/memory'
import { activeModerator } from '@/lib/moderation'
import type { Character } from '@/types/database'

// Lazy-init so the build doesn't throw when GROQ_API_KEY isn't set yet.
function getGroq() {
  return new Groq({ apiKey: process.env.GROQ_API_KEY })
}

// How many recent messages to pass verbatim. Older messages are handled by the
// memory layer (compressed into summary + facts).
const RECENT_MESSAGES_LIMIT = 10

export async function POST(request: NextRequest) {
  // ── Auth ──────────────────────────────────────────────────
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }

  // ── Parse body ────────────────────────────────────────────
  let conversationId: string
  let content: string

  try {
    const body = await request.json()
    conversationId = body.conversationId
    content = body.content?.trim()
  } catch {
    return new Response('Invalid JSON', { status: 400 })
  }

  if (!conversationId || !content) {
    return new Response('conversationId and content are required', { status: 400 })
  }

  // ── Load conversation (RLS enforces ownership) ────────────
  const { data: convData } = await supabase
    .from('conversations')
    .select('*')
    .eq('id', conversationId)
    .single()

  if (!convData) {
    return new Response('Conversation not found', { status: 404 })
  }

  // ── Load character ────────────────────────────────────────
  const { data: charData } = await supabase
    .from('characters')
    .select('*')
    .eq('id', convData.character_id)
    .single()

  if (!charData) {
    return new Response('Character not found', { status: 404 })
  }

  const character = charData as Character

  // ── Moderation ────────────────────────────────────────────
  const modResult = await activeModerator.check(content, character.mode)
  if (!modResult.allowed) {
    return new Response(
      JSON.stringify({ moderated: true, reason: modResult.reason }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }

  // ── Load memory + recent history in parallel ──────────────
  const [memory, historyResult] = await Promise.all([
    loadMemory(supabase, conversationId),
    supabase
      .from('messages')
      .select('role, content')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .limit(RECENT_MESSAGES_LIMIT),
  ])

  const history = (historyResult.data ?? []) as { role: string; content: string }[]
  const isFirstMessage = history.length === 0

  // Save user message to DB
  await supabase
    .from('messages')
    .insert({ conversation_id: conversationId, role: 'user', content })

  // Use the opening message as the conversation title
  if (isFirstMessage) {
    const shortTitle = content.length > 60 ? content.slice(0, 57) + '…' : content
    await supabase
      .from('conversations')
      .update({ title: shortTitle })
      .eq('id', conversationId)
  }

  // ── Build system prompt — inject memory if present ────────
  let systemPrompt = buildSystemPrompt(character)
  if (memory) {
    systemPrompt += formatMemoryBlock(memory)
  }

  // Build Anthropic-style messages: history + new user message
  const messages = [
    ...history.map(m => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    })),
    { role: 'user' as const, content },
  ]

  // ── Stream from Groq ──────────────────────────────────────
  let fullText = ''

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder()

      try {
        const groqStream = await getGroq().chat.completions.create({
          model: 'llama-3.3-70b-versatile',
          max_tokens: 1024,
          messages: [{ role: 'system', content: systemPrompt }, ...messages],
          stream: true,
        })

        for await (const chunk of groqStream) {
          const text = chunk.choices[0]?.delta?.content ?? ''
          if (text) {
            fullText += text
            controller.enqueue(encoder.encode(text))
          }
        }

        // Save the completed assistant message
        await supabase
          .from('messages')
          .insert({ conversation_id: conversationId, role: 'assistant', content: fullText })

        // Signal to the client that streaming is done
        controller.close()

        // Trigger memory compression AFTER the stream closes.
        // The client is already done — this runs in the background on the server.
        await maybeCompressMemory(supabase, conversationId, character.name)
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Unknown error'
        controller.enqueue(encoder.encode(`\n\n[Error: ${msg}]`))
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}
