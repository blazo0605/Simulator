import { PageContent } from '@/components/ui/layout'

export default function DashboardLoading() {
  return (
    <PageContent>
      <div className="space-y-8">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="h-7 w-44 rounded-lg skeleton" />
            <div className="h-4 w-24 rounded-lg skeleton" />
          </div>
          <div className="h-9 w-32 rounded-lg skeleton" />
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 rounded-2xl skeleton"
                 style={{ animationDelay: `${i * 0.08}s` }} />
          ))}
        </div>
      </div>
    </PageContent>
  )
}
