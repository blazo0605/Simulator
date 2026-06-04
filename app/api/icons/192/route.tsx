import { ImageResponse } from 'next/og'

export function GET() {
  return new ImageResponse(
    <div
      style={{
        width: 192,
        height: 192,
        background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
        borderRadius: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: 110,
        fontWeight: 700,
        fontFamily: 'system-ui',
      }}
    >
      P
    </div>,
    { width: 192, height: 192 }
  )
}
