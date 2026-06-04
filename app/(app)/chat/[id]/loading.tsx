export default function ChatLoading() {
  return (
    <div
      className="flex flex-col animate-pulse"
      style={{ height: 'calc(100dvh - 7.5rem)' }}
    >
      {/* Header */}
      <div className="border-b border-zinc-800 px-2 py-3 flex items-center gap-3 shrink-0">
        <div className="h-4 w-4 rounded bg-zinc-700" />
        <div className="h-5 w-32 rounded-lg bg-zinc-800" />
        <div className="h-5 w-20 rounded-full bg-zinc-800" />
      </div>

      {/* Message area */}
      <div className="flex-1 px-2 py-6 space-y-5 min-h-0">
        <div className="flex justify-start">
          <div className="h-16 w-64 rounded-2xl bg-zinc-800 rounded-bl-sm" />
        </div>
        <div className="flex justify-end">
          <div className="h-10 w-48 rounded-2xl bg-violet-900/40 rounded-br-sm" />
        </div>
        <div className="flex justify-start">
          <div className="h-24 w-72 rounded-2xl bg-zinc-800 rounded-bl-sm" />
        </div>
      </div>

      {/* Input bar */}
      <div className="border-t border-zinc-800 px-2 pt-3 pb-2 shrink-0">
        <div className="h-12 rounded-xl bg-zinc-800" />
      </div>
    </div>
  )
}
