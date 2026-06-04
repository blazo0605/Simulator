'use client'

// ChatUI — the interactive chat interface.
// Client Component: manages streaming state, moderation feedback, and mode-specific UI.

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import type { Character, Conversation, Message } from '@/types/database'

interface Props {
  conversation: Conversation
  character: Character
  initialMessages: Message[]
}

// UIMessage extends the DB Message shape with streaming + system message support.
// 'system' role is used for in-app notices (e.g. moderation blocks) — never sent to AI.
interface UIMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
  streaming?: boolean
}

export function ChatUI({ conversation, character, initialMessages }: Props) {
  const [messages, setMessages] = useState<UIMessage[]>(initialMessages)
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage() {
    const content = input.trim()
    if (!content || isStreaming) return

    setInput('')
    setIsStreaming(true)

    // Optimistically show the user message and an empty streaming bubble
    setMessages(prev => [...prev, { role: 'user', content }])
    setMessages(prev => [...prev, { role: 'assistant', content: '', streaming: true }])

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId: conversation.id, content }),
      })

      // ── Moderation block ─────────────────────────────────
      if (response.status === 400) {
        const data = await response.json().catch(() => null)
        // Remove the empty assistant bubble
        setMessages(prev => prev.slice(0, -1))
        if (data?.moderated) {
          // Add an in-app system notice explaining why the message was blocked
          setMessages(prev => [
            ...prev,
            { role: 'system', content: data.reason ?? 'Message blocked by content filter.' },
          ])
        }
        return
      }

      if (!response.ok) throw new Error(`Request failed: ${response.status}`)

      // ── Stream response ──────────────────────────────────
      const reader = response.body!.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        setMessages(prev => {
          const updated = [...prev]
          const last = updated[updated.length - 1]
          if (last?.streaming) {
            updated[updated.length - 1] = { ...last, content: last.content + chunk }
          }
          return updated
        })
      }

      // Mark the last message as done (removes blinking cursor)
      setMessages(prev => {
        const updated = [...prev]
        const last = updated[updated.length - 1]
        if (last?.streaming) {
          updated[updated.length - 1] = { ...last, streaming: false }
        }
        return updated
      })
    } catch {
      setMessages(prev => {
        const without = prev.slice(0, -1)
        return [
          ...without,
          { role: 'assistant', content: 'Something went wrong. Please try again.' },
        ]
      })
    } finally {
      setIsStreaming(false)
      textareaRef.current?.focus()
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const isFun = character.mode === 'fun'

  return (
    <div className="flex flex-col" style={{ height: 'calc(100dvh - 7.5rem)' }}>
      {/* ── Header ───────────────────────────────────────────── */}
      <div className="border-b border-zinc-800 px-2 py-3 shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href={`/characters/${character.id}`}
            className="text-zinc-500 hover:text-zinc-300 transition-colors text-sm px-1"
            aria-label="Back to character"
          >
            ←
          </Link>
          <span className="text-base font-semibold text-white truncate">
            {character.name}
          </span>
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${
              isFun
                ? 'bg-amber-500/20 text-amber-300'
                : 'bg-sky-500/20 text-sky-300'
            }`}
          >
            {isFun ? '🎭 Fun' : '🏛️ Perspective'}
          </span>
        </div>

        {/* Learning goals banner — only in perspective mode when goals are set */}
        {!isFun && character.learning_goals && (
          <p className="mt-2 ml-8 text-xs text-sky-400/70 leading-relaxed">
            <span className="font-medium text-sky-400">Goal:</span>{' '}
            {character.learning_goals}
          </p>
        )}
      </div>

      {/* ── Message list ─────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-2 py-6 space-y-5 min-h-0">
        {messages.length === 0 && <EmptyState character={character} />}

        {messages.map((msg, i) => (
          <Bubble key={i} message={msg} characterName={character.name} />
        ))}

        <div ref={bottomRef} />
      </div>

      {/* ── Input bar ────────────────────────────────────────── */}
      <div className="border-t border-zinc-800 px-2 pt-3 pb-2 shrink-0">
        <div className="flex items-end gap-2">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isStreaming}
            placeholder={
              isFun
                ? `Speak to ${character.name}…`
                : `Ask ${character.name} a question…`
            }
            rows={1}
            className="flex-1 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm
                       text-white placeholder-zinc-500 outline-none resize-none
                       focus:border-violet-500 focus:ring-1 focus:ring-violet-500
                       disabled:opacity-50 transition-colors"
            style={{ maxHeight: '120px', overflowY: 'auto' }}
          />
          <button
            onClick={sendMessage}
            disabled={isStreaming || !input.trim()}
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-violet-600
                       hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed
                       transition-colors shrink-0"
            aria-label="Send message"
          >
            {isStreaming ? (
              <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            ) : (
              <span className="text-white text-lg leading-none">↑</span>
            )}
          </button>
        </div>
        <p className="text-center text-xs text-zinc-600 mt-2">
          Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  )
}

// ── Empty state — different copy per mode ─────────────────────
function EmptyState({ character }: { character: Character }) {
  const isFun = character.mode === 'fun'

  return (
    <div className="text-center text-zinc-500 text-sm mt-16 space-y-2">
      <p className="text-3xl">{isFun ? '🎭' : '🏛️'}</p>
      <p>
        {isFun ? (
          <>
            You've entered the scene. Say something to{' '}
            <span className="text-white font-medium">{character.name}</span>.
          </>
        ) : (
          <>
            Begin your dialogue with{' '}
            <span className="text-white font-medium">{character.name}</span>.
          </>
        )}
      </p>
      {!isFun && (
        <p className="text-xs text-zinc-600 max-w-xs mx-auto">
          Ask about their experiences, views, or historical context. You can ask
          meta-questions too — they'll step outside the persona briefly to explain.
        </p>
      )}
    </div>
  )
}

// ── Message bubble ────────────────────────────────────────────
function Bubble({
  message,
  characterName,
}: {
  message: UIMessage
  characterName: string
}) {
  // System messages (moderation notices) render as a centred notice, not a chat bubble
  if (message.role === 'system') {
    return (
      <div className="flex justify-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30
                         bg-amber-500/10 px-3 py-1.5 text-xs text-amber-400">
          <span>⚠</span>
          {message.content}
        </span>
      </div>
    )
  }

  const isUser = message.role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className="max-w-[80%] space-y-1">
        {!isUser && (
          <p className="text-xs text-zinc-500 ml-1">{characterName}</p>
        )}
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
            isUser
              ? 'bg-violet-600 text-white rounded-br-sm'
              : 'bg-zinc-800 text-zinc-100 rounded-bl-sm'
          }`}
        >
          {message.content}
          {message.streaming && (
            <span className="inline-block w-1.5 h-[1em] bg-zinc-400 animate-pulse ml-0.5 align-middle rounded-sm" />
          )}
        </div>
      </div>
    </div>
  )
}
