'use client';

import { useState, FormEvent } from 'react';
import styles from './EmailSignup.module.css';

type Status = 'idle' | 'loading' | 'success' | 'duplicate' | 'error';

export default function EmailSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [validationError, setValidationError] = useState('');

  function validateEmail(value: string): string {
    if (!value.trim()) return 'Email is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Enter a valid email address.';
    return '';
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const error = validateEmail(email);
    if (error) {
      setValidationError(error);
      return;
    }
    setValidationError('');
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
          <div className={styles.successWrap}>
            <span className={styles.successCheck}>&#10003;</span>
            <p className={styles.message}>you&apos;re in. watch your inbox.</p>
          </div>
        ) : (
          <>
            <form className={styles.form} onSubmit={handleSubmit} noValidate>
              <div className={styles.inputWrap}>
                <input
                  type="email"
                  placeholder="your email"
                  aria-label="Email address for drop alerts"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (validationError) setValidationError('');
                  }}
                  className={`${styles.input} ${validationError ? styles.inputError : ''}`}
                />
                {validationError && (
                  <p className={styles.inlineError}>{validationError}</p>
                )}
              </div>
              <button type="submit" className={`btn btn-primary ${styles.button}`} disabled={status === 'loading'}>
                {status === 'loading' ? 'Sending...' : 'GET DROP ALERTS'}
              </button>
            </form>
          </>
        )}

        {status === 'duplicate' && (
          <p className={styles.messageDuplicate}>already subscribed! you&apos;re on the list.</p>
        )}
        {status === 'error' && (
          <p className={styles.messageError}>something went wrong. try again.</p>
        )}
      </div>
    </section>
  );
}
