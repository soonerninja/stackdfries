'use client';

import { useState, useEffect } from 'react';
import styles from './OpeningBanner.module.css';

const DISMISS_KEY = 'stackd-opening-banner-dismissed';

export default function OpeningBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!sessionStorage.getItem(DISMISS_KEY)) {
      setVisible(true);
    }
  }, []);

  const dismiss = () => {
    setVisible(false);
    sessionStorage.setItem(DISMISS_KEY, '1');
  };

  if (!visible) return null;

  return (
    <div className={styles.banner}>
      <p className={styles.text}>
        🔥 GRAND OPENING — MAY 2ND 🔥
      </p>
      <button className={styles.dismiss} onClick={dismiss} aria-label="Dismiss banner">
        ×
      </button>
    </div>
  );
}
