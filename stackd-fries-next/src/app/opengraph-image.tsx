import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = "Stack'd Fries — Oklahoma's Premium Loaded Fries"
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0A0A0A',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0px',
        }}
      >
        {/* Fry crown */}
        <div style={{ display: 'flex', gap: '4px', alignItems: 'flex-end', marginBottom: '8px' }}>
          <div style={{ width: '14px', height: '50px', background: 'linear-gradient(to top, #D4A843, #F2C744)', borderRadius: '4px', transform: 'rotate(-20deg)' }} />
          <div style={{ width: '14px', height: '60px', background: 'linear-gradient(to top, #D4A843, #F2C744)', borderRadius: '4px', transform: 'rotate(-10deg)' }} />
          <div style={{ width: '14px', height: '70px', background: 'linear-gradient(to top, #D4A843, #F2C744)', borderRadius: '4px' }} />
          <div style={{ width: '14px', height: '60px', background: 'linear-gradient(to top, #D4A843, #F2C744)', borderRadius: '4px', transform: 'rotate(10deg)' }} />
          <div style={{ width: '14px', height: '50px', background: 'linear-gradient(to top, #D4A843, #F2C744)', borderRadius: '4px', transform: 'rotate(20deg)' }} />
        </div>

        {/* STACK'D */}
        <div
          style={{
            fontSize: 120,
            fontWeight: 900,
            color: '#FFFFFF',
            letterSpacing: '-2px',
            lineHeight: 1,
            fontFamily: 'sans-serif',
          }}
        >
          STACK&apos;D
        </div>

        {/* Divider line */}
        <div style={{ width: '320px', height: '2px', background: 'linear-gradient(to right, transparent, #FFFFFF, transparent)', margin: '4px 0' }} />

        {/* FRIES */}
        <div
          style={{
            fontSize: 60,
            fontWeight: 700,
            color: '#D4A843',
            letterSpacing: '16px',
            lineHeight: 1,
            fontFamily: 'sans-serif',
          }}
        >
          FRIES
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 24,
            color: '#999999',
            marginTop: '32px',
            letterSpacing: '4px',
            textTransform: 'uppercase',
            fontFamily: 'sans-serif',
          }}
        >
          Oklahoma&apos;s Premium Loaded Fries
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
