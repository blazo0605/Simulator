'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { StaggerList, StaggerItem, springs } from '@/components/ui/motion'
import type { Character } from '@/types/database'

export function CharacterGrid({ characters }: { characters: Character[] }) {
  if (characters.length === 0) return <EmptyState />

  return (
    <StaggerList className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {characters.map(c => (
        <StaggerItem key={c.id}>
          <CharacterCard character={c} />
        </StaggerItem>
      ))}
    </StaggerList>
  )
}

function CharacterCard({ character }: { character: Character }) {
  const isFun = character.mode === 'fun'
  const preview = character.personality.length > 85
    ? character.personality.slice(0, 82) + '…'
    : character.personality

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.015 }}
      whileTap={{ scale: 0.975 }}
      transition={springs.snappy}
      className="h-full"
    >
      <Link
        href={`/characters/${character.id}`}
        className="group flex flex-col h-full rounded-2xl p-5 space-y-3 transition-all"
        style={{
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: 'var(--shadow-2), inset 0 1px 0 rgba(255,255,255,0.06)',
        }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLAnchorElement
          el.style.borderColor = 'rgba(124,58,237,0.30)'
          el.style.boxShadow = 'var(--shadow-3), 0 0 20px rgba(124,58,237,0.10), inset 0 1px 0 rgba(255,255,255,0.08)'
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLAnchorElement
          el.style.borderColor = 'rgba(255,255,255,0.08)'
          el.style.boxShadow = 'var(--shadow-2), inset 0 1px 0 rgba(255,255,255,0.06)'
        }}
      >
        <div className="flex items-start justify-between gap-2">
          <span
            className="text-sm font-semibold text-[--text] leading-snug group-hover:text-white transition-colors"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {character.name}
          </span>
          <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
            isFun ? 'bg-amber-500/15 text-amber-300' : 'bg-sky-500/15 text-sky-300'
          }`}>
            {isFun ? '🎭 Zabavni' : '🏛️ Edukativni'}
          </span>
        </div>
        <p className="text-xs text-[--text-muted] leading-relaxed flex-1">{preview}</p>
      </Link>
    </motion.div>
  )
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 280, damping: 28 }}
      className="flex flex-col items-center justify-center rounded-2xl py-20 text-center space-y-4"
      style={{
        border: '1px dashed rgba(255,255,255,0.10)',
        background: 'rgba(255,255,255,0.02)',
      }}
    >
      <span className="text-4xl">🎭</span>
      <div className="space-y-1">
        <p className="text-sm font-medium text-[--text]">Nemaš još nijednog lika</p>
        <p className="text-xs text-[--text-muted] max-w-[240px]">
          Likovi pamte ko su u svakom razgovoru. Napravi jednog da počneš.
        </p>
      </div>
      <motion.div whileHover={{ y: -2, scale: 1.03 }} whileTap={{ scale: 0.96 }} transition={springs.snappy}>
        <Link
          href="/characters/new"
          className="rounded-lg px-5 py-2.5 text-sm font-medium text-white transition-colors"
          style={{ background: 'var(--accent)', boxShadow: 'var(--shadow-accent)' }}
        >
          + Novi lik
        </Link>
      </motion.div>
    </motion.div>
  )
}
