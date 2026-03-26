'use client';

import { useState, FormEvent } from 'react';
import styles from './EmailSignup.module.css';

type Status = 'idle' | 'loading' | 'success' | 'duplicate' | 'error';

export default function EmailSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');

    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setEmail('');
      } else if (data.code === 'duplicate') {
        setStatus('duplicate');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  return (
    <section className={`${styles.section} reveal`}>
      <div className="container">
        <h2 className="section-title">THE LIST</h2>
        <p className={styles.subtitle}>Drop alerts. Secret menu items. First dibs.</p>

        {status === 'success' ? (
          <p className={styles.message}>you&apos;re in. watch your inbox.</p>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              required
            />
            <button type="submit" className={`btn btn-primary ${styles.button}`} disabled={status === 'loading'}>
              {status === 'loading' ? 'Sending...' : 'GET DROP ALERTS'}
            </button>
          </form>
        )}

        {status === 'duplicate' && (
          <p className={styles.messageMuted}>you&apos;re already on the list.</p>
        )}
        {status === 'error' && (
          <p className={styles.messageError}>something went wrong. try again.</p>
        )}
      </div>
    </section>
  );
}
