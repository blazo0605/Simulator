// Purely decorative background — aurora orbs + film grain.
// Rendered server-side with no JS. Fixed position so it scrolls with nothing.
// All motion uses `transform` only (GPU layer, no layout thrash).
export function AmbientBackground() {
  return (
    <div aria-hidden="true" className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="aurora-orb aurora-1" />
      <div className="aurora-orb aurora-2" />
      <div className="aurora-orb aurora-3" />
      <div className="grain-overlay" />
    </div>
  )
}
