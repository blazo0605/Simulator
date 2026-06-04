'use client'

// Character creator form.
// Must be a Client Component because useActionState is a React hook.
// All the actual saving logic is in app/actions/characters.ts (server-side).

import { useActionState } from 'react'
import Link from 'next/link'
import { createCharacter } from '@/app/actions/characters'
import { SubmitButton } from '@/components/ui/SubmitButton'

export default function NewCharacterPage() {
  const [state, formAction] = useActionState(createCharacter, null)

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <Link href="/dashboard" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
          ← Back to dashboard
        </Link>
        <h1 className="text-2xl font-bold text-white mt-3">New character</h1>
        <p className="text-zinc-400 mt-1">
          The more detail you provide, the more convincingly your character will speak.
        </p>
      </div>

      <form action={formAction} className="space-y-6">
        {/* Name */}
        <Field label="Name" required>
          <input
            name="name"
            type="text"
            placeholder="e.g. Sherlock Holmes, Ada Lovelace, a grumpy wizard…"
            required
            className={inputClass}
          />
        </Field>

        {/* Mode selector */}
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-zinc-300">
            Mode <span className="text-red-400">*</span>
          </span>
          <p className="text-xs text-zinc-500 -mt-1">
            Fun mode is freeform roleplay. Perspective mode is educational — the AI stays factual and reflective.
          </p>
          <div className="grid grid-cols-2 gap-3 mt-1">
            <ModeCard value="fun" emoji="🎭" title="Fun" description="Immersive creative roleplay" />
            <ModeCard value="perspective" emoji="🏛️" title="Perspective" description="Educational dialogue" />
          </div>
        </div>

        {/* Personality */}
        <Field
          label="Personality"
          hint="Core traits and how this character approaches the world."
          required
        >
          <textarea
            name="personality"
            rows={3}
            placeholder="e.g. Fiercely logical, socially detached, occasionally rude but brilliant. Believes emotion clouds judgment."
            required
            className={textareaClass}
          />
        </Field>

        {/* Background */}
        <Field
          label="Background"
          hint="History, context, and key facts the character would know."
          required
        >
          <textarea
            name="background"
            rows={3}
            placeholder="e.g. Victorian-era detective living at 221B Baker Street. Has experience with chemistry, violin, and disguises."
            required
            className={textareaClass}
          />
        </Field>

        {/* Speech style */}
        <Field
          label="Speech style"
          hint="How this character talks — vocabulary, tone, quirks."
          required
        >
          <textarea
            name="speech_style"
            rows={2}
            placeholder="e.g. Clipped, precise sentences. Uses deductive reasoning aloud. Often says 'Elementary.' Rarely uses contractions."
            required
            className={textareaClass}
          />
        </Field>

        {/* Knowledge scope */}
        <Field
          label="Knowledge scope"
          hint="What topics this character knows well — and what they don't know."
          required
        >
          <textarea
            name="knowledge_scope"
            rows={2}
            placeholder="e.g. Expert in criminal investigation, chemistry, botany, and London geography. Ignorant of astronomy (considers it irrelevant)."
            required
            className={textareaClass}
          />
        </Field>

        {/* Learning goals (perspective mode) */}
        <Field
          label="Learning goals"
          hint="What should the user come away understanding? Mainly useful for Perspective mode."
        >
          <textarea
            name="learning_goals"
            rows={2}
            placeholder="e.g. Understand how deductive reasoning works, the limits of Victorian forensic science, and how Holmes differs from modern detectives."
            className={textareaClass}
          />
        </Field>

        {/* Error message */}
        {state?.error && (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {state.error}
          </p>
        )}

        <SubmitButton label="Create character" pendingLabel="Creating…" />
      </form>
    </div>
  )
}

// Shared Tailwind classes
const inputClass =
  'w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm ' +
  'text-white placeholder-zinc-500 outline-none ' +
  'focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors'

const textareaClass =
  'w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm ' +
  'text-white placeholder-zinc-500 outline-none resize-none ' +
  'focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors'

// Wrapper that adds a label + optional hint above any input
function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string
  hint?: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-zinc-300">
        {label} {required && <span className="text-red-400">*</span>}
      </span>
      {hint && <p className="text-xs text-zinc-500 -mt-1">{hint}</p>}
      {children}
    </div>
  )
}

// A radio-button-styled mode card
function ModeCard({
  value,
  emoji,
  title,
  description,
}: {
  value: string
  emoji: string
  title: string
  description: string
}) {
  return (
    <label className="relative cursor-pointer">
      <input
        type="radio"
        name="mode"
        value={value}
        required
        className="peer sr-only"
      />
      <div className="rounded-xl border border-zinc-700 bg-zinc-900 p-4 space-y-1
                      peer-checked:border-violet-500 peer-checked:bg-violet-500/10
                      hover:border-zinc-500 transition-colors">
        <div className="text-xl">{emoji}</div>
        <div className="text-sm font-semibold text-white">{title}</div>
        <div className="text-xs text-zinc-400">{description}</div>
      </div>
    </label>
  )
}
