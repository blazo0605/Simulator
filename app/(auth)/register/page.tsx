'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { register } from '@/app/actions/auth'
import { springs } from '@/components/ui/motion'

const glassInput =
  'w-full rounded-xl px-4 py-2.5 text-sm text-[--text] placeholder:text-[--text-muted] outline-none transition-all'

export default function RegisterPage() {
  const [state, action] = useActionState(register, null)

  if (state?.success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={springs.gentle}
        className="text-center space-y-4 py-4"
      >
        <div className="text-4xl">📬</div>
        <h1 className="text-xl font-semibold text-[--text]" style={{ fontFamily: 'var(--font-display)' }}>
          Provjeri email
        </h1>
        <p className="text-sm text-[--text-muted]">
          Poslali smo potvrdu na tvoju adresu. Klikni na link da aktiviraš nalog.
        </p>
        <Link href="/login" className="inline-block text-sm text-violet-400 hover:text-violet-300 transition-colors">
          Nazad na prijavu
        </Link>
      </motion.div>
    )
  }

  return (
    <>
      <div>
        <h1 className="text-xl font-semibold text-[--text]" style={{ fontFamily: 'var(--font-display)' }}>
          Napravi nalog
        </h1>
        <p className="text-sm text-[--text-muted] mt-1">Besplatno. Bez kartice.</p>
      </div>

      <form action={action} className="space-y-4">
        <GlassField label="Email" name="email" type="email"
          placeholder="ti@primjer.com" autoComplete="email" />
        <GlassField label="Lozinka" name="password" type="password"
          placeholder="Najmanje 6 znakova" autoComplete="new-password" />

        {state?.error && (
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={springs.snappy}
            className="text-sm text-red-400 rounded-xl px-3 py-2"
            style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.22)' }}
          >
            {state.error}
          </motion.p>
        )}

        <GlassSubmit label="Napravi nalog" pendingLabel="Kreiranje…" />
      </form>

      <p className="text-center text-sm text-[--text-muted]">
        Već imaš nalog?{' '}
        <Link href="/login" className="text-violet-400 hover:text-violet-300 transition-colors">
          Prijavi se
        </Link>
      </p>
    </>
  )
}

function GlassField({ label, name, type, placeholder, autoComplete }: {
  label: string; name: string; type?: string;
  placeholder?: string; autoComplete?: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-sm font-medium text-[--text]">{label}</label>
      <input
        id={name} name={name} type={type} placeholder={placeholder}
        required autoComplete={autoComplete}
        className={glassInput}
        style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.09)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
        }}
        onFocus={e => {
          e.currentTarget.style.border = '1px solid rgba(124,58,237,0.55)'
          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.14), inset 0 1px 0 rgba(255,255,255,0.05)'
        }}
        onBlur={e => {
          e.currentTarget.style.border = '1px solid rgba(255,255,255,0.09)'
          e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.05)'
        }}
      />
    </div>
  )
}

function GlassSubmit({ label, pendingLabel }: { label: string; pendingLabel: string }) {
  const { pending } = useFormStatus()
  return (
    <motion.button
      type="submit"
      disabled={pending}
      whileHover={pending ? {} : { y: -1, scale: 1.02 }}
      whileTap={pending ? {} : { scale: 0.97 }}
      transition={springs.snappy}
      className="flex items-center justify-center gap-2 w-full rounded-lg px-4 py-2.5
                 text-sm font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed"
      style={{
        background: 'var(--accent)',
        boxShadow: pending ? 'none' : 'var(--shadow-accent)',
      }}
    >
      {pending && <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />}
      {pending ? pendingLabel : label}
    </motion.button>
  )
}
