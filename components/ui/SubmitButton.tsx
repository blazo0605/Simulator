'use client'

// useFormStatus lets a button know if the nearest parent <form> is pending.
// It must be used inside a Client Component — hence the 'use client' directive.
import { useFormStatus } from 'react-dom'

interface SubmitButtonProps {
  label: string
  pendingLabel?: string
}

export function SubmitButton({
  label,
  pendingLabel = 'Please wait…',
}: SubmitButtonProps) {
  // pending becomes true the moment the form submits and stays true until the
  // Server Action returns. We use it to disable the button and show a spinner.
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="flex items-center justify-center gap-2 w-full rounded-lg
                 bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white
                 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed
                 transition-colors"
    >
      {pending && (
        <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
      )}
      {pending ? pendingLabel : label}
    </button>
  )
}
