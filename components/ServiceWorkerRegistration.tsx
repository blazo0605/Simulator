'use client'

// Registers the service worker once the page has loaded.
// Must be a Client Component — service worker APIs are browser-only.
// Renders nothing; purely a side-effect component.

import { useEffect } from 'react'

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .catch(() => {
          // Registration failure is non-fatal — the app works fine without the SW
        })
    }
  }, [])

  return null
}
