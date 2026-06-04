import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="flex flex-col flex-1 items-center justify-center px-6 py-24 text-center">
      <div className="space-y-5 max-w-sm">
        <p className="text-5xl">🎭</p>
        <h1 className="text-2xl font-bold text-white">Page not found</h1>
        <p className="text-zinc-400">
          That page doesn't exist — or the character you were looking for has
          left the stage.
        </p>
        <Link
          href="/dashboard"
          className="inline-block rounded-lg bg-violet-600 px-5 py-2.5 text-sm
                     font-semibold text-white hover:bg-violet-500 transition-colors"
        >
          Back to dashboard
        </Link>
      </div>
    </main>
  )
}
