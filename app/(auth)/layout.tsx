// Route groups: wrapping folder names in () groups routes without affecting the URL.
// So this layout applies to /login and /register, but the URL is /login — not /(auth)/login.
//
// This layout just centres everything in a card. The main (app) layout will be different
// (it has a nav bar and requires the user to be logged in).

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        {/* Brand mark */}
        <div className="text-center mb-8">
          <span className="text-2xl font-bold text-white tracking-tight">
            Persona<span className="text-violet-400">Sim</span>
          </span>
        </div>
        {children}
      </div>
    </div>
  )
}
