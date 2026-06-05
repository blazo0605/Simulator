'use client'

// Shared Framer Motion primitives.
// All components here are Client Components — they can safely receive server-rendered children.

import { motion, AnimatePresence, type Variants, type Transition } from 'framer-motion'
export { AnimatePresence }

// ── Spring presets ─────────────────────────────────────────────────────────
export const springs = {
  snappy: { type: 'spring', stiffness: 400, damping: 30 } satisfies Transition,
  gentle: { type: 'spring', stiffness: 260, damping: 28 } satisfies Transition,
  bouncy: { type: 'spring', stiffness: 320, damping: 20 } satisfies Transition,
  slow:   { type: 'spring', stiffness: 130, damping: 24 } satisfies Transition,
  page:   { type: 'spring', stiffness: 280, damping: 32 } satisfies Transition,
}

// ── Page/section entrance — wrap server-rendered page content ──────────────
export function FadeIn({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...springs.page, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ── Staggered list — container keeps children in sync ─────────────────────
const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.04 },
  },
}

const staggerItemVariant: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.97 },
  show: {
    opacity: 1, y: 0, scale: 1,
    transition: { type: 'spring', stiffness: 320, damping: 28 },
  },
}

export function StaggerList({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <motion.ul
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className={className}
    >
      {children}
    </motion.ul>
  )
}

export function StaggerItem({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <motion.li variants={staggerItemVariant} className={className}>
      {children}
    </motion.li>
  )
}

// ── Card with hover lift ───────────────────────────────────────────────────
export function MotionCard({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.015 }}
      whileTap={{ scale: 0.975 }}
      transition={springs.snappy}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ── Button with press physics ──────────────────────────────────────────────
export function MotionLink({
  children,
  href,
  className = '',
}: {
  children: React.ReactNode
  href: string
  className?: string
}) {
  return (
    <motion.a
      href={href}
      whileHover={{ y: -1, scale: 1.02 }}
      whileTap={{ scale: 0.96 }}
      transition={springs.snappy}
      className={className}
    >
      {children}
    </motion.a>
  )
}

// ── Animated step container for multi-step forms ──────────────────────────
const stepVariants: Variants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 48 : -48,
    opacity: 0,
    scale: 0.98,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 300, damping: 30 },
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -48 : 48,
    opacity: 0,
    scale: 0.98,
    transition: { duration: 0.18, ease: 'easeIn' },
  }),
}

export function AnimatedStep({
  children,
  stepKey: key,
  direction,
}: {
  children: React.ReactNode
  stepKey: number
  direction: number
}) {
  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={key}
        custom={direction}
        variants={stepVariants}
        initial="enter"
        animate="center"
        exit="exit"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

// ── Message bubble entrance (used in chat) ────────────────────────────────
export function MessageBubble({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
