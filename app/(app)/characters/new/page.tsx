'use client'

import { useActionState, useState } from 'react'
import { useFormStatus } from 'react-dom'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { createCharacter } from '@/app/actions/characters'
import { PageContent } from '@/components/ui/layout'
import { springs } from '@/components/ui/motion'

/* ── Step definitions ─────────────────────────────────────────── */
const STEPS = [
  { id: 1, label: 'Osnove' },
  { id: 2, label: 'Karakter' },
  { id: 3, label: 'Detalji' },
]

type FormValues = {
  name: string; mode: string
  personality: string; background: string
  speech_style: string; knowledge_scope: string; learning_goals: string
}

/* ── Page ─────────────────────────────────────────────────────── */
export default function NewCharacterPage() {
  const [step, setStep] = useState(1)
  const [dir, setDir] = useState(1)
  const [values, setValues] = useState<FormValues>({
    name: '', mode: '',
    personality: '', background: '',
    speech_style: '', knowledge_scope: '', learning_goals: '',
  })
  const [stepError, setStepError] = useState('')
  const [state, action] = useActionState(createCharacter, null)

  function set(field: keyof FormValues, value: string) {
    setValues(v => ({ ...v, [field]: value }))
    setStepError('')
  }

  function goNext() {
    if (step === 1 && !values.name.trim())  { setStepError('Upiši ime lika.'); return }
    if (step === 1 && !values.mode)         { setStepError('Odaberi način.'); return }
    if (step === 2 && !values.personality.trim()) { setStepError('Opiši ličnost.'); return }
    if (step === 2 && !values.background.trim())  { setStepError('Opiši pozadinu.'); return }
    setDir(1); setStep(s => s + 1); setStepError('')
  }

  function goBack() {
    setDir(-1); setStep(s => s - 1); setStepError('')
  }

  const slideVariants = {
    enter:  (d: number) => ({ x: d > 0 ? 52 : -52, opacity: 0, scale: 0.97 }),
    center: { x: 0, opacity: 1, scale: 1,
               transition: { type: 'spring' as const, stiffness: 300, damping: 30 } },
    exit:   (d: number) => ({ x: d > 0 ? -52 : 52, opacity: 0, scale: 0.97,
                               transition: { duration: 0.16, ease: 'easeIn' as const } }),
  }

  return (
    <PageContent>
      <div className="max-w-[42rem]">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={springs.page}>

          {/* Back link */}
          <Link href="/dashboard" className="text-xs text-[--text-muted] hover:text-[--text] transition-colors">
            ← Nazad na tablu
          </Link>

          {/* Header */}
          <h1 className="text-xl font-semibold text-[--text] mt-3">Novi lik</h1>
          <p className="text-sm text-[--text-muted] mt-1">
            Što više detalja dadneš, uvjerljivije će tvoj lik govoriti.
          </p>

          {/* Progress indicator */}
          <div className="flex items-center gap-2 mt-6 mb-7">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex items-center gap-2">
                <motion.div
                  animate={{
                    scale: step === s.id ? 1 : 0.85,
                    opacity: step >= s.id ? 1 : 0.35,
                  }}
                  transition={springs.snappy}
                  className="flex items-center gap-1.5"
                >
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold"
                    style={{
                      background: step >= s.id ? 'var(--accent)' : 'rgba(255,255,255,0.06)',
                      border: step === s.id ? '1px solid rgba(124,58,237,0.5)' : '1px solid rgba(255,255,255,0.10)',
                      boxShadow: step === s.id ? 'var(--shadow-accent)' : 'none',
                      color: step >= s.id ? '#fff' : 'var(--text-muted)',
                    }}
                  >
                    {step > s.id ? '✓' : s.id}
                  </div>
                  <span className={`text-xs font-medium ${step === s.id ? 'text-[--text]' : 'text-[--text-dim]'}`}>
                    {s.label}
                  </span>
                </motion.div>

                {i < STEPS.length - 1 && (
                  <motion.div
                    className="h-px flex-1 w-8"
                    animate={{ background: step > s.id ? 'var(--accent)' : 'rgba(255,255,255,0.08)' }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Form with hidden inputs carrying previously-entered data */}
          <form action={action}>
            {step > 1 && <input type="hidden" name="name"        value={values.name} />}
            {step > 1 && <input type="hidden" name="mode"        value={values.mode} />}
            {step > 2 && <input type="hidden" name="personality" value={values.personality} />}
            {step > 2 && <input type="hidden" name="background"  value={values.background} />}

            {/* Animated step content */}
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div
                key={step}
                custom={dir}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                {step === 1 && <Step1 values={values} set={set} />}
                {step === 2 && <Step2 values={values} set={set} />}
                {step === 3 && <Step3 values={values} set={set} serverError={state?.error} />}
              </motion.div>
            </AnimatePresence>

            {/* Step error */}
            <AnimatePresence>
              {stepError && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }} transition={springs.snappy}
                  className="mt-4 text-sm text-red-400 rounded-xl px-4 py-2.5"
                  style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.22)' }}
                >
                  {stepError}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex gap-3 mt-6">
              {step > 1 && (
                <motion.button
                  type="button" onClick={goBack}
                  whileHover={{ x: -2 }} whileTap={{ scale: 0.95 }} transition={springs.snappy}
                  className="rounded-lg px-4 py-2.5 text-sm font-medium text-[--text-muted]
                             hover:text-[--text] transition-colors"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)' }}
                >
                  ← Nazad
                </motion.button>
              )}

              {step < 3 && (
                <motion.button
                  type="button" onClick={goNext}
                  whileHover={{ x: 2, scale: 1.02 }} whileTap={{ scale: 0.96 }} transition={springs.snappy}
                  className="flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-colors"
                  style={{ background: 'var(--accent)', boxShadow: 'var(--shadow-accent)' }}
                >
                  Dalje →
                </motion.button>
              )}

              {step === 3 && <FinalSubmit />}
            </div>
          </form>
        </motion.div>
      </div>
    </PageContent>
  )
}

/* ── Step 1: Name + Mode ──────────────────────────────────────── */
function Step1({ values, set }: { values: FormValues; set: (f: keyof FormValues, v: string) => void }) {
  return (
    <div className="space-y-5">
      <GlassField label="Ime" hint="Ime tvog lika." required>
        <input
          name="name" type="text" value={values.name} onChange={e => set('name', e.target.value)}
          placeholder="npr. Šerlok Holmz, Nikola Tesla, mudri čarobnjak…"
          className={inputCls}
          style={inputStyle}
          onFocus={glowFocus} onBlur={glowBlur}
        />
      </GlassField>

      <div className="space-y-2">
        <span className="text-sm font-medium text-[--text]">
          Način <span className="text-red-400">*</span>
        </span>
        <p className="text-xs text-[--text-muted]">
          Zabavni je slobodna igra uloga. Edukativni ostaje faktički tačan i refleksivan.
        </p>
        <div className="grid grid-cols-2 gap-3 mt-1">
          <ModeCard value="fun"         emoji="🎭" title="Zabavni"
            desc="Uranjanje u lik i slobodna igra uloga"
            selected={values.mode === 'fun'} onSelect={() => set('mode', 'fun')} />
          <ModeCard value="perspective" emoji="🏛️" title="Edukativni"
            desc="Edukativni dijalog, historijska tačnost"
            selected={values.mode === 'perspective'} onSelect={() => set('mode', 'perspective')} />
        </div>
      </div>
    </div>
  )
}

/* ── Step 2: Personality + Background ────────────────────────── */
function Step2({ values, set }: { values: FormValues; set: (f: keyof FormValues, v: string) => void }) {
  return (
    <div className="space-y-5">
      <GlassField label="Ličnost" hint="Ključne osobine i pristup svijetu." required>
        <textarea rows={3} name="personality" value={values.personality}
          onChange={e => set('personality', e.target.value)}
          placeholder="npr. Znatiželjan, topao, ponekad sarkastičan. Voli logiku i preciznost."
          className={textareaCls} style={inputStyle} onFocus={glowFocus} onBlur={glowBlur} />
      </GlassField>
      <GlassField label="Pozadina" hint="Historija, kontekst i ključne činjenice koje lik poznaje." required>
        <textarea rows={3} name="background" value={values.background}
          onChange={e => set('background', e.target.value)}
          placeholder="npr. Viktorijanski detektiv u Londonu. Stručnjak za hemiju, botaniku i kriminalistiku."
          className={textareaCls} style={inputStyle} onFocus={glowFocus} onBlur={glowBlur} />
      </GlassField>
    </div>
  )
}

/* ── Step 3: Speech + Knowledge + Goals ──────────────────────── */
function Step3({ values, set, serverError }: {
  values: FormValues; set: (f: keyof FormValues, v: string) => void; serverError?: string
}) {
  return (
    <div className="space-y-5">
      <GlassField label="Stil govora" hint="Kako lik govori — rječnik, ton, maniri." required>
        <textarea rows={2} name="speech_style" value={values.speech_style}
          onChange={e => set('speech_style', e.target.value)}
          placeholder="npr. Kratke, precizne rečenice. Razmišlja naglas. Rijetko koristi kontrakcije."
          className={textareaCls} style={inputStyle} onFocus={glowFocus} onBlur={glowBlur} />
      </GlassField>
      <GlassField label="Domen znanja" hint="Koje teme lik dobro poznaje — i koje ne." required>
        <textarea rows={2} name="knowledge_scope" value={values.knowledge_scope}
          onChange={e => set('knowledge_scope', e.target.value)}
          placeholder="npr. Stručnjak za kriminalistiku, hemiju i botaniku. Ne zanima ga astronomija."
          className={textareaCls} style={inputStyle} onFocus={glowFocus} onBlur={glowBlur} />
      </GlassField>
      <GlassField label="Ciljevi učenja" hint="Šta bi korisnik trebalo da razumije? Korisno za edukativni način.">
        <textarea rows={2} name="learning_goals" value={values.learning_goals}
          onChange={e => set('learning_goals', e.target.value)}
          placeholder="npr. Razumjeti deduktivno razmišljanje i granice viktorijanske forenzike."
          className={textareaCls} style={inputStyle} onFocus={glowFocus} onBlur={glowBlur} />
      </GlassField>
      {serverError && (
        <p className="text-sm text-red-400 rounded-xl px-4 py-2.5"
           style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.22)' }}>
          {serverError}
        </p>
      )}
    </div>
  )
}

/* ── Final submit button ──────────────────────────────────────── */
function FinalSubmit() {
  const { pending } = useFormStatus()
  return (
    <motion.button
      type="submit" disabled={pending}
      whileHover={pending ? {} : { y: -1, scale: 1.02 }}
      whileTap={pending ? {} : { scale: 0.97 }}
      transition={springs.snappy}
      className="flex-1 flex items-center justify-center gap-2 rounded-lg px-4 py-2.5
                 text-sm font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed"
      style={{ background: 'var(--accent)', boxShadow: pending ? 'none' : 'var(--shadow-accent)' }}
    >
      {pending && <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />}
      {pending ? 'Kreiranje…' : 'Napravi lik'}
    </motion.button>
  )
}

/* ── Field wrapper ────────────────────────────────────────────── */
function GlassField({ label, hint, required, children }: {
  label: string; hint?: string; required?: boolean; children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <span className="text-sm font-medium text-[--text]">
        {label} {required && <span className="text-red-400">*</span>}
      </span>
      {hint && <p className="text-xs text-[--text-muted]">{hint}</p>}
      {children}
    </div>
  )
}

/* ── Mode card ────────────────────────────────────────────────── */
function ModeCard({ value, emoji, title, desc, selected, onSelect }: {
  value: string; emoji: string; title: string; desc: string; selected: boolean; onSelect: () => void
}) {
  return (
    <motion.button
      type="button" onClick={onSelect}
      whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: 0.97 }}
      transition={springs.snappy}
      animate={{
        borderColor: selected ? 'rgba(124,58,237,0.55)' : 'rgba(255,255,255,0.08)',
        boxShadow: selected
          ? '0 0 16px rgba(124,58,237,0.18), inset 0 1px 0 rgba(255,255,255,0.07)'
          : 'inset 0 1px 0 rgba(255,255,255,0.05)',
      }}
      className="relative w-full text-left rounded-xl p-4 space-y-1 transition-all cursor-pointer"
      style={{
        background: selected ? 'rgba(124,58,237,0.10)' : 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      {/* Hidden radio for form submission */}
      <input type="radio" name="mode" value={value} checked={selected} onChange={onSelect} className="sr-only" />
      <div className="text-xl">{emoji}</div>
      <div className="text-sm font-semibold text-[--text]" style={{ fontFamily: 'var(--font-display)' }}>
        {title}
      </div>
      <div className="text-xs text-[--text-muted]">{desc}</div>
    </motion.button>
  )
}

/* ── Input style helpers ──────────────────────────────────────── */
const inputCls   = 'w-full rounded-xl px-4 py-2.5 text-sm text-[--text] placeholder:text-[--text-muted] outline-none transition-all'
const textareaCls = 'w-full rounded-xl px-4 py-2.5 text-sm text-[--text] placeholder:text-[--text-muted] outline-none resize-none transition-all'
const inputStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.09)',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
}
const glowFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  e.currentTarget.style.border = '1px solid rgba(124,58,237,0.55)'
  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.14), inset 0 1px 0 rgba(255,255,255,0.05)'
}
const glowBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  e.currentTarget.style.border = '1px solid rgba(255,255,255,0.09)'
  e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.05)'
}
