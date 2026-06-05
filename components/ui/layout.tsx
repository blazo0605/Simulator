// Shared layout primitives — import these instead of repeating
// max-width / spacing patterns inline everywhere.

// Horizontal container: constrains to app max-width + horizontal padding.
// Use `size="sm"` for forms / narrow single-column pages.
export function Container({
  children,
  className = '',
  size = 'default',
}: {
  children: React.ReactNode
  className?: string
  size?: 'default' | 'sm'
}) {
  const maxW = size === 'sm' ? 'max-w-[42rem]' : 'max-w-[64rem]'
  return (
    <div className={`w-full ${maxW} mx-auto px-4 ${className}`}>
      {children}
    </div>
  )
}

// Standard page content wrapper: vertical rhythm for authenticated pages.
// Wrap each page's root element in this so all pages share the same top/bottom padding.
export function PageContent({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`py-8 ${className}`}>
      {children}
    </div>
  )
}

// Vertical stack with consistent gap.
export function Stack({
  children,
  gap = 6,
  className = '',
}: {
  children: React.ReactNode
  gap?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
  className?: string
}) {
  const gapMap: Record<number, string> = {
    1: 'space-y-1', 2: 'space-y-2', 3: 'space-y-3',
    4: 'space-y-4', 5: 'space-y-5', 6: 'space-y-6',
    7: 'space-y-7', 8: 'space-y-8',
  }
  return (
    <div className={`${gapMap[gap]} ${className}`}>
      {children}
    </div>
  )
}

// Responsive two-column grid that collapses to one column on small screens.
export function Grid({
  children,
  cols = 2,
  gap = 3,
  className = '',
}: {
  children: React.ReactNode
  cols?: 1 | 2 | 3
  gap?: 2 | 3 | 4 | 5 | 6
  className?: string
}) {
  const colsMap: Record<number, string> = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  }
  return (
    <div className={`grid ${colsMap[cols]} gap-${gap} ${className}`}>
      {children}
    </div>
  )
}
