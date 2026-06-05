'use client'

import { useFormStatus } from 'react-dom'

interface SubmitButtonProps {
  label: string
  pendingLabel?: string
}

export function SubmitButton({ label, pendingLabel = 'Please wait…' }: SubmitButtonProps) {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="flex items-center justify-center gap-2 w-full rounded-lg
                 bg-[--accent] px-4 py-2.5 text-sm font-semibold text-white
                 hover:bg-[--accent-h] disabled:opacity-50 disabled:cursor-not-allowed
                 transition-colors active:scale-[0.99]"
    >
      {pending && (
        <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
      )}
      {pending ? pendingLabel : label}
    </button>
  )
}
