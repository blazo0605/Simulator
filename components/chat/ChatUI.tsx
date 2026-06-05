'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { springs } from '@/components/ui/motion'
import type { Character, Conversation, Message } from '@/types/database'

interface Props {
  conversation: Conversation
  character: Character
  initialMessages: Message[]
}

interface UIMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  streaming?: boolean
}

function uid() {
  return Math.random().toString(36).slice(2)
}

function avatarColor(name: string) {
  const palette = [
    'bg-violet-600', 'bg-amber-600', 'bg-sky-600',
    'bg-emerald-600', 'bg-rose-600', 'bg-orange-500',
  ]
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xffff
  return palette[h % palette.length]
}

export function ChatUI({ conversation, character, initialMessages }: Props) {
  const [messages, setMessages] = useState<UIMessage[]>(
    initialMessages.map(m => ({ ...m, id: uid() }))
  )
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => { scrollToBottom() }, [messages, scrollToBottom])

  async function sendMessage() {
    const content = input.trim()
    if (!content || isStreaming) return

    setInput('')
    setIsStreaming(true)

    const userMsg: UIMessage = { id: uid(), role: 'user', content }
    const assistantMsg: UIMessage = { id: uid(), role: 'assistant', content: '', streaming: true }
    const assistantId = assistantMsg.id

    setMessages(prev => [...prev, userMsg, assistantMsg])

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId: conversation.id, content }),
      })

      if (res.status === 400) {
        const data = await res.json().catch(() => null)
        setMessages(prev => prev.filter(m => m.id !== assistantId))
        if (data?.moderated) {
          setMessages(prev => [
            ...prev,
            { id: uid(), role: 'system', content: data.reason ?? 'Poruka blokirana filtrom sadržaja.' },
          ])
        }
        return
      }

      if (!res.ok) throw new Error(`Greška: ${res.status}`)

      const reader = res.body!.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        setMessages(prev => prev.map(m =>
          m.id === assistantId ? { ...m, content: m.content + chunk } : m
        ))
      }

      setMessages(prev => prev.map(m =>
        m.id === assistantId ? { ...m, streaming: false } : m
      ))
    } catch {
      setMessages(prev => prev.map(m =>
        m.id === assistantId
          ? { ...m, content: 'Nešto je pošlo naopako. Pokušaj ponovo.', streaming: false }
          : m
      ))
    } finally {
      setIsStreaming(false)
      textareaRef.current?.focus()
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  const isFun = character.mode === 'fun'
  const initial = character.name.trim()[0]?.toUpperCase() ?? '?'
  const color = avatarColor(character.name)

  return (
    <div className="flex-1 min-h-0 flex flex-col">

      {/* ── Character header ──────────────────────────────── */}
      <div
        className="shrink-0 px-4 py-3"
        style={{
          background: 'rgba(0,0,0,0.45)',
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          boxShadow: 'inset 0 -1px 0 rgba(255,255,255,0.04)',
        }}
      >
        <div className="flex items-center gap-3">
          <Link href={`/characters/${character.id}`}
            className="text-[--text-muted] hover:text-[--text] transition-colors text-sm
                       w-7 flex items-center justify-center shrink-0">
            ←
          </Link>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs
                           font-bold text-white shrink-0 ${color} ring-2 ring-white/10`}>
            {initial}
          </div>
          <span className="text-[15px] font-semibold text-[--text] truncate tracking-wide"
                style={{ fontFamily: 'var(--font-display)' }}>
            {character.name}
          </span>
          <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
            isFun ? 'bg-amber-500/15 text-amber-300' : 'bg-sky-500/15 text-sky-300'
          }`}>
            {isFun ? '🎭 Zabavni' : '🏛️ Edukativni'}
          </span>
        </div>
        {!isFun && character.learning_goals && (
          <p className="mt-1.5 ml-[3.75rem] text-[11px] text-sky-400/60 leading-relaxed">
            <span className="text-sky-400/90 font-medium">Cilj:</span>{' '}
            {character.learning_goals}
          </p>
        )}
      </div>

      {/* ── Messages ─────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 py-6 min-h-0">
        {messages.length === 0 && <EmptyState character={character} />}

        <AnimatePresence initial={false}>
          {messages.map(msg => {
            if (msg.streaming && msg.content === '') {
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  className="mb-5"
                >
                  <ThinkingBubble name={character.name} initial={initial} color={color} />
                </motion.div>
              )
            }
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 12, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                className="mb-5"
              >
                <Bubble msg={msg} name={character.name} initial={initial} color={color} />
              </motion.div>
            )
          })}
        </AnimatePresence>

        <div ref={bottomRef} className="h-1" />
      </div>

      {/* ── Input bar ────────────────────────────────────── */}
      <div
        className="shrink-0 px-4 pt-3 pb-3"
        style={{
          background: 'rgba(0,0,0,0.45)',
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          borderTop: '1px solid rgba(255,255,255,0.07)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
        }}
      >
        <div className="flex items-end gap-2">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isStreaming}
            placeholder={isFun ? `Reci nešto ${character.name}…` : `Postavi pitanje ${character.name}…`}
            rows={1}
            className="flex-1 rounded-xl px-4 py-3 text-sm text-[--text]
                       placeholder:text-[--text-muted] outline-none resize-none
                       disabled:opacity-40 min-h-[44px]"
            style={{
              maxHeight: '120px', overflowY: 'auto',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.09)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)',
              transition: 'border-color 0.15s, box-shadow 0.15s',
            }}
            onFocus={e => {
              e.currentTarget.style.border = '1px solid rgba(124,58,237,0.50)'
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.15), inset 0 1px 0 rgba(255,255,255,0.06)'
            }}
            onBlur={e => {
              e.currentTarget.style.border = '1px solid rgba(255,255,255,0.09)'
              e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.06)'
            }}
          />

          <motion.button
            onClick={sendMessage}
            disabled={isStreaming || !input.trim()}
            whileHover={isStreaming || !input.trim() ? {} : { scale: 1.08, y: -1 }}
            whileTap={isStreaming || !input.trim() ? {} : { scale: 0.92 }}
            transition={springs.snappy}
            className="flex items-center justify-center w-11 h-11 rounded-xl bg-[--accent]
                       hover:bg-[--accent-h] disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
            style={{ boxShadow: 'var(--shadow-accent)' }}
            aria-label="Pošalji"
          >
            {isStreaming
              ? <span className="w-4 h-4 rounded-full border-2 border-white/25 border-t-white animate-spin" />
              : <span className="text-white text-base leading-none">↑</span>
            }
          </motion.button>
        </div>
        <p className="text-center text-[11px] text-[--text-dim] mt-2 select-none">
          Enter za slanje · Shift+Enter za novi red
        </p>
      </div>
    </div>
  )
}

/* ── Empty state ───────────────────────────────────────────────── */
function EmptyState({ character }: { character: Character }) {
  const isFun = character.mode === 'fun'
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 28 }}
      className="text-center py-20 space-y-3"
    >
      <motion.p
        className="text-4xl"
        animate={{ y: [0, -6, 0] }}
        transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
      >
        {isFun ? '🎭' : '🏛️'}
      </motion.p>
      <div className="space-y-1">
        <p className="text-base text-[--text] tracking-wide" style={{ fontFamily: 'var(--font-display)' }}>
          {character.name}
        </p>
        <p className="text-sm text-[--text-muted]">
          {isFun ? 'Scena je postavljena. Obrati mu se.' : 'Počni razgovor. Postavi pitanje.'}
        </p>
      </div>
      {!isFun && (
        <p className="text-xs text-[--text-dim] max-w-[260px] mx-auto leading-relaxed">
          Pitaj o iskustvima, stavovima ili historijskom kontekstu.
        </p>
      )}
    </motion.div>
  )
}

/* ── Typing indicator ─────────────────────────────────────────── */
function ThinkingBubble({ name, initial, color }: { name: string; initial: string; color: string }) {
  return (
    <div className="flex items-end gap-2.5">
      <Avatar initial={initial} color={color} />
      <div>
        <p className="text-[11px] text-[--text-muted] mb-1.5 ml-0.5"
           style={{ fontFamily: 'var(--font-display)' }}>
          {name}
        </p>
        <div
          className="rounded-2xl rounded-bl-sm px-4 py-3.5 flex gap-1.5 items-center"
          style={{
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.09)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)',
          }}
        >
          {[0, 1, 2].map(i => (
            <motion.span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-violet-400/70"
              animate={{ y: [0, -5, 0], opacity: [0.35, 1, 0.35] }}
              transition={{
                repeat: Infinity, duration: 1.1,
                delay: i * 0.17,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── Message bubble ────────────────────────────────────────────── */
function Bubble({ msg, name, initial, color }: {
  msg: UIMessage; name: string; initial: string; color: string
}) {
  if (msg.role === 'system') {
    return (
      <div className="flex justify-center">
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs text-amber-400/90"
          style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.22)' }}
        >
          ⚠ {msg.content}
        </span>
      </div>
    )
  }

  if (msg.role === 'user') {
    return (
      <div className="flex justify-end">
        <div className="max-w-[78%]">
          <div
            className="rounded-2xl rounded-br-sm px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap text-white"
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
              border: '1px solid rgba(167,139,250,0.25)',
              boxShadow: 'var(--shadow-accent), var(--shadow-2), inset 0 1px 0 rgba(255,255,255,0.14)',
            }}
          >
            {msg.content}
          </div>
        </div>
      </div>
    )
  }

  // assistant
  return (
    <div className="flex items-end gap-2.5">
      <Avatar initial={initial} color={color} />
      <div className="max-w-[78%]">
        <p className="text-[11px] text-[--text-muted] mb-1.5 ml-0.5"
           style={{ fontFamily: 'var(--font-display)' }}>
          {name}
        </p>
        <div
          className="rounded-2xl rounded-bl-sm px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap text-[--text]"
          style={{
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.09)',
            boxShadow: 'var(--shadow-2), inset 0 1px 0 rgba(255,255,255,0.065)',
          }}
        >
          {msg.content}
          {/* Glowing streaming cursor */}
          {msg.streaming && (
            <span
              className="cursor-glow"
              style={{ height: '0.9em', marginLeft: '2px' }}
            />
          )}
        </div>
      </div>
    </div>
  )
}

/* ── Avatar ─────────────────────────────────────────────────────── */
function Avatar({ initial, color }: { initial: string; color: string }) {
  return (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center
                     text-xs font-bold text-white shrink-0 ${color}
                     ring-2 ring-white/10`}>
      {initial}
    </div>
  )
}
