import { PageContent } from '@/components/ui/layout'

export default function CharacterLoading() {
  return (
    <PageContent>
      <div className="space-y-8">
        <div className="space-y-3">
          <div className="h-4 w-32 rounded skeleton" />
          <div className="flex items-center gap-3">
            <div className="h-7 w-48 rounded-lg skeleton" />
            <div className="h-5 w-20 rounded-full skeleton" />
          </div>
        </div>

        <div className="rounded-2xl p-6 space-y-5"
             style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="space-y-1.5" style={{ animationDelay: `${i * 0.06}s` }}>
              <div className="h-3 w-24 rounded skeleton" />
              <div className="h-4 w-full rounded skeleton" />
              <div className="h-4 w-3/4 rounded skeleton" />
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="h-6 w-36 rounded-lg skeleton" />
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-14 rounded-xl skeleton"
                 style={{ animationDelay: `${i * 0.07}s` }} />
          ))}
        </div>
      </div>
    </PageContent>
  )
}
