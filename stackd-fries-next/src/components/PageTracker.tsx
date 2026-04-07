'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function PageTracker() {
  const pathname = usePathname();
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;

    // Don't track admin pages
    if (pathname.startsWith('/admin')) return;

    // Don't track bots
    const ua = navigator.userAgent.toLowerCase();
    if (ua.includes('bot') || ua.includes('crawler')) return;

    tracked.current = true;

    const payload = JSON.stringify({
      page: pathname,
      referrer: document.referrer || undefined,
      screen_width: screen.width,
    });

    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/track', new Blob([payload], { type: 'application/json' }));
    } else {
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
      }).catch(() => {
        // Silently fail - tracking is non-critical
      });
    }
  }, [pathname]);

  return null;
}
