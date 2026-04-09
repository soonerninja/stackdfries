import { ImageResponse } from 'next/og';

// Next.js metadata file convention: generates /apple-icon.png at build time
// and injects <link rel="apple-touch-icon"> into the document head automatically.
export const runtime = 'edge';
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0A0A0A',
          borderRadius: '36px',
        }}
      >
        <div
          style={{
            fontSize: 68,
            fontWeight: 900,
            color: '#F2C744',
            letterSpacing: '-2px',
            lineHeight: 1,
            fontFamily: 'sans-serif',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <span style={{ color: '#FFFFFF' }}>SF</span>
        </div>
      </div>
    ),
    size
  );
}
