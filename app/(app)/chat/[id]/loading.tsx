export default function ChatLoading() {
  return (
    <div className="flex-1 min-h-0 flex flex-col">
      {/* Header */}
      <div className="shrink-0 px-4 py-3 flex items-center gap-3"
           style={{
             background: 'rgba(0,0,0,0.45)',
             backdropFilter: 'blur(28px)',
             WebkitBackdropFilter: 'blur(28px)',
             borderBottom: '1px solid rgba(255,255,255,0.07)',
           }}>
        <div className="h-4 w-4 rounded skeleton" />
        <div className="h-8 w-8 rounded-full skeleton" />
        <div className="h-5 w-36 rounded-lg skeleton" />
        <div className="h-5 w-20 rounded-full skeleton" />
      </div>

      {/* Messages */}
      <div className="flex-1 px-4 py-6 space-y-5 min-h-0">
        <div className="flex justify-start gap-2.5">
          <div className="w-8 h-8 rounded-full skeleton shrink-0" />
          <div className="h-20 w-64 rounded-2xl rounded-bl-sm skeleton" />
        </div>
        <div className="flex justify-end">
          <div className="h-12 w-52 rounded-2xl rounded-br-sm skeleton" />
        </div>
        <div className="flex justify-start gap-2.5">
          <div className="w-8 h-8 rounded-full skeleton shrink-0" />
          <div className="h-28 w-72 rounded-2xl rounded-bl-sm skeleton" />
        </div>
      </div>

      {/* Input */}
      <div className="shrink-0 px-4 pt-3 pb-3"
           style={{
             background: 'rgba(0,0,0,0.45)',
             backdropFilter: 'blur(28px)',
             WebkitBackdropFilter: 'blur(28px)',
             borderTop: '1px solid rgba(255,255,255,0.07)',
           }}>
        <div className="h-11 rounded-xl skeleton" />
      </div>
    </div>
  )
}
