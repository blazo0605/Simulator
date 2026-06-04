import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'PersonaSim',
    short_name: 'PersonaSim',
    description: 'AI roleplay and perspective simulator',
    start_url: '/dashboard',
    display: 'standalone',
    background_color: '#0f0f0f',
    theme_color: '#7c3aed',
    orientation: 'portrait',
    icons: [
      {
        src: '/api/icons/192',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/api/icons/512',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
