import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="flex flex-col flex-1 items-center justify-center px-6 py-24 text-center">
      <div className="space-y-4 max-w-sm">
        <p className="text-5xl">🎭</p>
        <h1 className="text-xl font-semibold text-[--text]">Stranica nije pronađena</h1>
        <p className="text-sm text-[--text-muted]">
          Ta stranica ne postoji — ili je lik kojeg si tražio napustio scenu.
        </p>
        <Link
          href="/dashboard"
          className="inline-block rounded-lg bg-[--accent] hover:bg-[--accent-h] active:scale-95
                     px-5 py-2.5 text-sm font-medium text-white transition-all duration-150"
        >
          Nazad na tablu
        </Link>
      </div>
    </main>
  )
}
