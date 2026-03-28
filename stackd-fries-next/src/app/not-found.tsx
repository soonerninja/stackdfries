import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '20px',
      fontFamily: 'var(--font-body)',
    }}>
      <h1 style={{
        fontFamily: 'var(--font-display)',
        fontSize: '80px',
        color: 'var(--gold)',
        lineHeight: 1,
        marginBottom: '16px',
      }}>
        404
      </h1>
      <p style={{
        fontFamily: 'var(--font-display)',
        fontSize: '32px',
        color: 'var(--text-primary)',
        marginBottom: '8px',
      }}>
        WRONG TURN
      </p>
      <p style={{
        color: 'var(--text-secondary)',
        fontSize: '16px',
        marginBottom: '32px',
      }}>
        This page doesn&apos;t exist — but our fries do.
      </p>
      <Link
        href="/"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '14px 32px',
          background: 'var(--gold)',
          color: 'var(--black)',
          fontFamily: 'var(--font-label)',
          fontWeight: 600,
          fontSize: '14px',
          textTransform: 'uppercase',
          letterSpacing: '1.5px',
          borderRadius: '4px',
          textDecoration: 'none',
        }}
      >
        Back to the Fries
      </Link>
    </div>
  );
}
