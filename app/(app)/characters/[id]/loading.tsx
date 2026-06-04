export default function CharacterLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Back link + title */}
      <div className="space-y-3">
        <div className="h-4 w-32 rounded bg-zinc-800" />
        <div className="flex items-center gap-3">
          <div className="h-7 w-48 rounded-lg bg-zinc-800" />
          <div className="h-5 w-20 rounded-full bg-zinc-800" />
        </div>
      </div>

      {/* Character definition card */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-5">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="space-y-1.5">
            <div className="h-3 w-24 rounded bg-zinc-700" />
            <div className="h-4 w-full rounded bg-zinc-800" />
            <div className="h-4 w-3/4 rounded bg-zinc-800" />
          </div>
        ))}
      </div>

      {/* Conversation list */}
      <div className="space-y-4">
        <div className="h-6 w-36 rounded-lg bg-zinc-800" />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-14 rounded-xl border border-zinc-800 bg-zinc-900/60" />
        ))}
      </div>
    </div>
  )
}
