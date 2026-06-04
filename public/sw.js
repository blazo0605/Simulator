// PersonaSim service worker
// Strategy:
//   - Static Next.js chunks (_next/static/**): cache-first (they're content-hashed)
//   - API routes (/api/**): network-only (never cache live data)
//   - Everything else: network-first, fall back to cache

const CACHE = 'persona-sim-v1'

// Pre-cache the offline fallback shell
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(['/']))
  )
  self.skipWaiting()
})

// Delete old caches on activation
self.addEventListener('activate', event => {
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

  // Only handle same-origin GET requests
  if (request.method !== 'GET' || url.origin !== location.origin) return

  // API calls: always go to the network (streaming responses, auth, etc.)
  if (url.pathname.startsWith('/api/')) return

  // Next.js static chunks: cache-first (content-hashed filenames never change)
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached
        return fetch(request).then(response => {
          if (response.ok) {
            const clone = response.clone()
            caches.open(CACHE).then(cache => cache.put(request, clone))
          }
          return response
        })
      })
    )
    return
  }

  // Everything else (pages, manifests, icons): network-first, cache fallback
  event.respondWith(
    fetch(request)
      .then(response => {
        if (response.ok) {
          const clone = response.clone()
          caches.open(CACHE).then(cache => cache.put(request, clone))
        }
        return response
      })
      .catch(() => caches.match(request))
  )
})
