import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: 32,
        height: 32,
        background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
        borderRadius: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: 20,
        fontWeight: 700,
        fontFamily: 'system-ui',
      }}
    >
      P
    </div>,
    { ...size }
  )
}
