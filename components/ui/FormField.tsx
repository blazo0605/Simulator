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
      <label htmlFor={name} className="text-sm font-medium text-[--text]">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        className="rounded-xl border border-[--border] bg-[--surface] px-4 py-2.5 text-sm
                   text-[--text] placeholder:text-[--text-muted] outline-none
                   focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/40
                   transition-colors"
      />
    </div>
  )
}
