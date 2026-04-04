'use client';

import { useState } from 'react';
import styles from './catering.module.css';

export default function CateringPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [guestCount, setGuestCount] = useState('');
  const [eventType, setEventType] = useState('');
  const [details, setDetails] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim() || !email.trim()) return;

    setStatus('sending');

    const subject = encodeURIComponent(`Catering Inquiry — ${eventType || 'Event'}`);
    const body = encodeURIComponent(
      `Name: ${name}\n` +
      `Email: ${email}\n` +
      `Phone: ${phone || 'Not provided'}\n` +
      `Event Date: ${eventDate || 'TBD'}\n` +
      `Guest Count: ${guestCount || 'TBD'}\n` +
      `Event Type: ${eventType || 'Not specified'}\n` +
      `\nDetails:\n${details || 'N/A'}`
    );

    window.location.href = `mailto:stackfries@gmail.com?subject=${subject}&body=${body}`;
    setStatus('sent');
  }

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <a href="/" className={styles.back}>&larr; Back to Stack&apos;d Fries</a>

        <h1 className={styles.title}>CATERING</h1>
        <p className={styles.subtitle}>
          Private events. Game days. Parties. Weddings. Corporate lunches.
          Stack&apos;d pulls up wherever you need us.
        </p>

        {status === 'sent' ? (
          <div className={styles.success}>
            <div className={styles.successIcon}>&#10003;</div>
            <h2 className={styles.successTitle}>Email opened!</h2>
            <p className={styles.successText}>
              Your email app should have opened with the details filled in. Just hit send!
              If it didn&apos;t work, email us directly at{' '}
              <a href="mailto:stackfries@gmail.com">stackfries@gmail.com</a>.
            </p>
            <button onClick={() => setStatus('idle')} className="btn btn-outline">
              Fill out again
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className={styles.input}
                  placeholder="Your name"
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Email *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={styles.input}
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={styles.input}
                  placeholder="(405) 555-1234"
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Event Date</label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className={styles.input}
                />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>Guest Count</label>
                <input
                  type="number"
                  value={guestCount}
                  onChange={(e) => setGuestCount(e.target.value)}
                  className={styles.input}
                  placeholder="~50"
                  min="1"
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Event Type</label>
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className={styles.input}
                >
                  <option value="">Select one...</option>
                  <option value="Private Party">Private Party</option>
                  <option value="Corporate Event">Corporate Event</option>
                  <option value="Wedding">Wedding</option>
                  <option value="Game Day / Tailgate">Game Day / Tailgate</option>
                  <option value="Festival / Pop-up">Festival / Pop-up</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Tell us about your event</label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className={styles.textarea}
                rows={4}
                placeholder="Location, vibe, any special requests..."
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={status === 'sending'}>
              {status === 'sending' ? 'Opening email...' : 'Send Inquiry'}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
