'use client'

import { motion } from 'framer-motion'
import { springs } from '@/components/ui/motion'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col flex-1 items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={springs.page}
        className="w-full max-w-sm"
      >
        {/* Brand mark */}
        <div className="text-center mb-8">
          <span className="text-2xl font-bold text-[--text] tracking-tight">
            Persona<span className="text-violet-400">Sim</span>
          </span>
        </div>

        {/* Glass card */}
        <div
          className="rounded-2xl p-8 space-y-6"
          style={{
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.09)',
            boxShadow: 'var(--shadow-3), inset 0 1px 0 rgba(255,255,255,0.07)',
          }}
        >
          {children}
        </div>
      </motion.div>
    </div>
  )
}
