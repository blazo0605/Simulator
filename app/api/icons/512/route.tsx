import { ImageResponse } from 'next/og'

export function GET() {
  return new ImageResponse(
    <div
      style={{
        width: 512,
        height: 512,
        background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
        borderRadius: 96,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: 300,
        fontWeight: 700,
        fontFamily: 'system-ui',
      }}
    >
      P
    </div>,
    { width: 512, height: 512 }
  )
}
