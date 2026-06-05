'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { springs } from '@/components/ui/motion'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { ...springs.page, delay },
})

export function LandingHero() {
  return (
    <div className="w-full max-w-[42rem] mx-auto text-center space-y-8">

      {/* Badge */}
      <motion.div {...fadeUp(0)} className="inline-flex">
        <span className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs text-violet-300"
              style={{
                background: 'rgba(124,58,237,0.10)',
                border: '1px solid rgba(124,58,237,0.25)',
              }}>
          <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
          AI igra uloga i simulator perspektiva
        </span>
      </motion.div>

      {/* Hero headline — display serif */}
      <motion.h1
        {...fadeUp(0.08)}
        className="text-4xl sm:text-5xl font-bold tracking-tight text-[--text] leading-[1.15]"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        Uđi u bilo čiju{' '}
        <span className="text-violet-400 italic">perspektivu</span>
      </motion.h1>

      {/* Subtext */}
      <motion.p
        {...fadeUp(0.14)}
        className="text-base text-[--text-muted] leading-relaxed max-w-[32rem] mx-auto"
      >
        Napravi lik — čarobnjaka, historijsku ličnost, detektiva — i vodi pravi razgovor s njim.
        Svaki odgovor ostaje u liku, svaki detalj se pamti.
      </motion.p>

      {/* Feature cards — glass, staggered */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.09, delayChildren: 0.22 } },
        }}
        className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-left"
      >
        {[
          { emoji: '🎭', title: 'Zabavni način',
            desc: 'Uranjajuća igra uloga. Fantazijski svjetovi, avanture i kreativno pripovijedanje.' },
          { emoji: '🏛️', title: 'Edukativni način',
            desc: 'Razgovaraj s historijskim ličnostima, istraži različite poglede, uči kroz dijalog.' },
        ].map(card => (
          <motion.div
            key={card.title}
            variants={{
              hidden: { opacity: 0, y: 14, scale: 0.97 },
              show:  { opacity: 1, y: 0, scale: 1,
                       transition: { type: 'spring', stiffness: 300, damping: 28 } },
            }}
            whileHover={{ y: -3, scale: 1.02, transition: springs.snappy }}
            className="rounded-2xl p-5 space-y-2"
            style={{
              background: 'rgba(255,255,255,0.04)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)',
            }}
          >
            <div className="text-2xl">{card.emoji}</div>
            <h2 className="text-sm font-semibold text-[--text]" style={{ fontFamily: 'var(--font-display)' }}>
              {card.title}
            </h2>
            <p className="text-xs text-[--text-muted] leading-relaxed">{card.desc}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* CTAs */}
      <motion.div {...fadeUp(0.36)} className="flex flex-col sm:flex-row gap-3 justify-center pt-1">
        <motion.div whileHover={{ y: -2, scale: 1.03 }} whileTap={{ scale: 0.96 }} transition={springs.snappy}>
          <Link
            href="/register"
            className="inline-block rounded-lg bg-[--accent] hover:bg-[--accent-h]
                       px-6 py-3 text-sm font-semibold text-white transition-colors"
            style={{ boxShadow: 'var(--shadow-accent), var(--shadow-2)' }}
          >
            Počni besplatno
          </Link>
        </motion.div>
        <motion.div whileHover={{ y: -2, scale: 1.03 }} whileTap={{ scale: 0.96 }} transition={springs.snappy}>
          <Link
            href="/login"
            className="inline-block rounded-lg px-6 py-3 text-sm font-semibold
                       text-[--text-muted] hover:text-[--text] transition-colors"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.10)',
            }}
          >
            Prijava
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}
