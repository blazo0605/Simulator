'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { StaggerList, StaggerItem, springs } from '@/components/ui/motion'
import type { Conversation } from '@/types/database'

interface Props {
  conversations: Conversation[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  startConversation: (...args: any[]) => Promise<any>
}

export function ConversationList({ conversations, startConversation }: Props) {
  if (conversations.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 28 }}
        className="flex flex-col items-center justify-center rounded-2xl py-14 text-center space-y-3"
        style={{
          border: '1px dashed rgba(255,255,255,0.10)',
          background: 'rgba(255,255,255,0.02)',
        }}
      >
        <p className="text-sm text-[--text-muted]">Nema razgovora još.</p>
        <form action={startConversation}>
          <motion.button
            type="submit"
            whileHover={{ y: -2, scale: 1.03 }} whileTap={{ scale: 0.96 }}
            transition={springs.snappy}
            className="rounded-lg px-4 py-2 text-sm font-medium text-white"
            style={{ background: 'var(--accent)', boxShadow: 'var(--shadow-accent)' }}
          >
            Pokreni prvi razgovor
          </motion.button>
        </form>
      </motion.div>
    )
  }

  return (
    <StaggerList className="space-y-2">
      {conversations.map(conv => (
        <StaggerItem key={conv.id}>
          <ConvRow conv={conv} />
        </StaggerItem>
      ))}
    </StaggerList>
  )
}

function ConvRow({ conv }: { conv: Conversation }) {
  const date = new Date(conv.created_at).toLocaleDateString('sr-ME', {
    day: 'numeric', month: 'short', year: 'numeric',
  })

  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={springs.snappy}
    >
      <Link
        href={`/chat/${conv.id}`}
        className="flex items-center justify-between rounded-xl px-4 py-3.5 transition-all"
        style={{
          background: 'rgba(255,255,255,0.03)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.07)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
        }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLAnchorElement
          el.style.borderColor = 'rgba(124,58,237,0.28)'
          el.style.boxShadow = '0 0 14px rgba(124,58,237,0.08), inset 0 1px 0 rgba(255,255,255,0.06)'
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLAnchorElement
          el.style.borderColor = 'rgba(255,255,255,0.07)'
          el.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.04)'
        }}
      >
        <span className="text-sm text-[--text]">{conv.title}</span>
        <span className="text-xs text-[--text-muted] shrink-0 ml-4">{date}</span>
      </Link>
    </motion.div>
  )
}
