'use client';

import { useEffect, useState } from 'react';
import styles from './PromoPopup.module.css';

const STORAGE_KEY = 'sf_popup_seen';
const SHOW_DELAY_MS = 1200;

type Props = {
  title: string;
  body: string;
  ctaLabel: string;
  ctaUrl: string;
  version: string;
};

export default function PromoPopupClient({ title, body, ctaLabel, ctaUrl, version }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only show if this exact promo version hasn't been dismissed on this device.
    let dismissed: string | null = null;
    try {
      dismissed = window.localStorage.getItem(STORAGE_KEY);
    } catch {
      // localStorage unavailable (private mode etc.) — show once this session.
    }
    if (dismissed === version) return;

    const t = window.setTimeout(() => setVisible(true), SHOW_DELAY_MS);
    return () => window.clearTimeout(t);
  }, [version]);

  // Lock body scroll + close on Escape while open.
  useEffect(() => {
    if (!visible) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dismiss();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  function dismiss() {
    setVisible(false);
    try {
      window.localStorage.setItem(STORAGE_KEY, version);
    } catch {
      // ignore write failures
    }
  }

  if (!visible) return null;

  const hasCta = ctaLabel.trim().length > 0 && ctaUrl.trim().length > 0;
  const isExternal = /^https?:\/\//i.test(ctaUrl.trim());

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label={title.trim() || 'Announcement'}
      onClick={dismiss}
    >
      <div className={styles.card} onClick={e => e.stopPropagation()}>
        <button type="button" className={styles.close} onClick={dismiss} aria-label="Close">
          &times;
        </button>
        {title.trim() && <h2 className={styles.title}>{title.trim()}</h2>}
        {body.trim() && <p className={styles.body}>{body.trim()}</p>}
        {hasCta && (
          <a
            href={ctaUrl.trim()}
            className={styles.cta}
            onClick={dismiss}
            {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          >
            {ctaLabel.trim()}
          </a>
        )}
      </div>
    </div>
  );
}
