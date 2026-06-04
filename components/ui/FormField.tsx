// A reusable labelled input for forms.
// Keeping this in one place means every input looks the same across the app.

interface FormFieldProps {
  label: string
  name: string
  type?: string
  placeholder?: string
  required?: boolean
  autoComplete?: string
}

export function FormField({
  label,
  name,
  type = 'text',
  placeholder,
  required,
  autoComplete,
}: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-sm font-medium text-zinc-300">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        className="rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm
                   text-white placeholder-zinc-500 outline-none
                   focus:border-violet-500 focus:ring-1 focus:ring-violet-500
                   transition-colors"
      />
    </div>
  )
}
