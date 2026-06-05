// PersonaSim service worker
//
// Rule: NEVER intercept page navigations (request.mode === 'navigate').
// Caching HTML or redirects causes stale auth state and redirect loops on return visits.
//
// Only cache:
//   /_next/static/** — content-hashed JS/CSS chunks, safe to cache forever
//
// Never cache:
//   - Page HTML (navigate requests) — server must always handle these
//   - /api/** — live data, streaming, auth
//   - Everything else — let the browser decide

const CACHE = 'persona-sim-v1'

self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', event => {
  // Clean up any caches from previous SW versions
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', event => {
  const { request } = event
  const url = new URL(request.url)

  // Ignore non-GET and cross-origin requests
  if (request.method !== 'GET' || url.origin !== location.origin) return

  // ── Never intercept page navigations ─────────────────────
  // This is the critical rule. Caching HTML breaks auth (stale sessions,
  // cached redirects) and causes the infinite-refresh bug on return visits.
  if (request.mode === 'navigate') return

  // Never cache API calls (streaming, auth, live data)
  if (url.pathname.startsWith('/api/')) return

  // ── Cache Next.js static chunks ───────────────────────────
  // Files under /_next/static/ have content hashes in their names.
  // They never change for a given deploy, so cache-first is safe.
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached
        return fetch(request).then(response => {
          if (response.ok) {
            caches.open(CACHE).then(cache => cache.put(request, response.clone()))
          }
          return response
        })
      })
    )
  }
})
