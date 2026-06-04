// Shown automatically by Next.js while the dashboard Server Component loads.
// Uses animated pulse divs to hint at the shape of the real content.

export default function DashboardLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-7 w-44 rounded-lg bg-zinc-800" />
          <div className="h-4 w-24 rounded-lg bg-zinc-800" />
        </div>
        <div className="h-9 w-32 rounded-lg bg-zinc-800" />
      </div>

      {/* Character card grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-32 rounded-xl border border-zinc-800 bg-zinc-900/60"
          />
        ))}
      </div>
    </div>
  )
}
