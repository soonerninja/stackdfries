'use client';

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div style={{ minHeight: '50vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: 'var(--gold)', marginBottom: 16 }}>
        Something went wrong
      </h2>
      <button
        onClick={reset}
        style={{
          fontFamily: 'var(--font-label)',
          fontSize: 14,
          textTransform: 'uppercase',
          letterSpacing: '1.5px',
          background: 'var(--gold)',
          color: 'var(--black)',
          border: 'none',
          borderRadius: 4,
          padding: '14px 32px',
          cursor: 'pointer',
        }}
      >
        Try Again
      </button>
    </div>
  );
}
