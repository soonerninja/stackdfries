'use client';

import { useState, FormEvent } from 'react';
import styles from './CateringForm.module.css';

type Status = 'idle' | 'loading' | 'success' | 'error';

const EVENT_TYPES = [
  'Corporate',
  'Private Party',
  'Game Day',
  'Wedding',
  'Festival/Fair',
  'Other',
];

export default function CateringForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    event_date: '',
    headcount: '',
    event_type: '',
    message: '',
    company: '', // honeypot — real users leave this empty
  });
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): Record<string, string> {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Name is required.';
    if (!formData.email.trim()) {
      errs.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Enter a valid email address.';
    }
    if (!formData.event_date) errs.event_date = 'Event date is required.';
    if (!formData.headcount) {
      errs.headcount = 'Headcount is required.';
    } else if (parseInt(formData.headcount, 10) < 10) {
      errs.headcount = 'Minimum 10 guests.';
    }
    if (!formData.event_type) errs.event_type = 'Select an event type.';
    return errs;
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setStatus('loading');

    try {
      const res = await fetch('/api/catering', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          headcount: parseInt(formData.headcount, 10),
        }),
      });

      if (res.ok) {
        setStatus('success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          event_date: '',
          headcount: '',
          event_type: '',
          message: '',
          company: '',
        });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  return (
    <section id="catering" className={`${styles.section} reveal`}>
      <div className="container">
        <h2 className="section-title">CATERING &amp; EVENTS</h2>
        <p className={styles.subtitle}>
          OU game days, corporate events, private parties — we bring the stack.
        </p>

        {status === 'success' ? (
          <div className={styles.successWrap}>
            <span className={styles.successCheck}>&#10003;</span>
            <p className={styles.successMessage}>
              Got it! We&apos;ll be in touch within 24 hours.
            </p>
          </div>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            {/* Honeypot — hidden from real users, bots tend to fill it */}
            <input
              type="text"
              name="company"
              tabIndex={-1}
              autoComplete="off"
              value={formData.company}
              onChange={handleChange}
              style={{ position: 'absolute', left: '-10000px', width: 1, height: 1, opacity: 0 }}
              aria-hidden="true"
            />
            <div className={styles.row}>
              <div className={styles.field}>
                <label htmlFor="catering-name" className={styles.label}>Name *</label>
                <input
                  id="catering-name"
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                  placeholder="Your name"
                />
                {errors.name && <p className={styles.fieldError}>{errors.name}</p>}
              </div>
              <div className={styles.field}>
                <label htmlFor="catering-email" className={styles.label}>Email *</label>
                <input
                  id="catering-email"
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                  placeholder="you@example.com"
                />
                {errors.email && <p className={styles.fieldError}>{errors.email}</p>}
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label htmlFor="catering-phone" className={styles.label}>Phone</label>
                <input
                  id="catering-phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="(405) 555-0123"
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="catering-date" className={styles.label}>Event Date *</label>
                <input
                  id="catering-date"
                  type="date"
                  name="event_date"
                  required
                  value={formData.event_date}
                  onChange={handleChange}
                  className={`${styles.input} ${styles.dateInput} ${errors.event_date ? styles.inputError : ''}`}
                />
                {errors.event_date && <p className={styles.fieldError}>{errors.event_date}</p>}
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label htmlFor="catering-headcount" className={styles.label}>Estimated Headcount *</label>
                <input
                  id="catering-headcount"
                  type="number"
                  name="headcount"
                  required
                  min={10}
                  value={formData.headcount}
                  onChange={handleChange}
                  className={`${styles.input} ${errors.headcount ? styles.inputError : ''}`}
                  placeholder="50"
                />
                {errors.headcount && <p className={styles.fieldError}>{errors.headcount}</p>}
              </div>
              <div className={styles.field}>
                <label htmlFor="catering-type" className={styles.label}>Event Type *</label>
                <select
                  id="catering-type"
                  name="event_type"
                  required
                  value={formData.event_type}
                  onChange={handleChange}
                  className={`${styles.input} ${styles.select} ${errors.event_type ? styles.inputError : ''}`}
                >
                  <option value="">Select type...</option>
                  {EVENT_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                {errors.event_type && <p className={styles.fieldError}>{errors.event_type}</p>}
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="catering-message" className={styles.label}>Message / Details</label>
              <textarea
                id="catering-message"
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                className={`${styles.input} ${styles.textarea}`}
                placeholder="Tell us about your event..."
              />
            </div>

            <button
              type="submit"
              className={`btn btn-primary ${styles.submitBtn}`}
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Sending...' : 'SEND INQUIRY'}
            </button>

            {status === 'error' && (
              <p className={styles.errorMessage}>Something went wrong. Please try again.</p>
            )}
          </form>
        )}
      </div>
    </section>
  );
}
